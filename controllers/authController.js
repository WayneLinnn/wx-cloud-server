const axios = require('axios');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const config = require('../config/database');
const pool = mysql.createPool(config);

const WECHAT_APPID = 'wx5b89b5f779f7991a';
const WECHAT_SECRET = '0093fd72356299b864ca022824b5487f';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// 生成随机验证码
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
    // 微信登录
    async wechatLogin: async (req, res) => {
        try {
            const { code, phoneCode } = req.body;
            
            // 获取微信openid和session_key
            const wxResponse = await axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
                params: {
                    appid: WECHAT_APPID,
                    secret: WECHAT_SECRET,
                    js_code: code,
                    grant_type: 'authorization_code'
                }
            });

            const { openid, session_key } = wxResponse.data;

            // 检查用户是否存在
            const [users] = await pool.query('SELECT * FROM users WHERE openid = ?', [openid]);
            let user = users[0];

            if (!user) {
                // 创建新用户
                const [result] = await pool.query(
                    'INSERT INTO users (openid, session_key) VALUES (?, ?)',
                    [openid, session_key]
                );
                user = {
                    id: result.insertId,
                    openid,
                    session_key
                };
            } else {
                // 更新session_key
                await pool.query(
                    'UPDATE users SET session_key = ? WHERE id = ?',
                    [session_key, user.id]
                );
            }

            // 生成JWT token
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    nickname: user.nickname,
                    avatarUrl: user.avatar_url
                }
            });
        } catch (error) {
            console.error('微信登录错误:', error);
            res.status(500).json({
                success: false,
                message: '登录失败',
                error: error.message
            });
        }
    },

    // 发送验证码
    async sendVerificationCode: async (req, res) => {
        try {
            const { phone } = req.body;
            const code = generateVerificationCode();
            const expiresAt = new Date(Date.now() + 5 * 60000); // 5分钟后过期

            await pool.query(
                'INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)',
                [phone, code, expiresAt]
            );

            // TODO: 实际发送验证码的逻辑
            console.log(`验证码 ${code} 已发送到 ${phone}`);

            res.json({
                success: true,
                message: '验证码已发送'
            });
        } catch (error) {
            console.error('发送验证码错误:', error);
            res.status(500).json({
                success: false,
                message: '发送验证码失败',
                error: error.message
            });
        }
    },

    // 验证码登录
    async phoneLogin: async (req, res) => {
        try {
            const { phone, code } = req.body;

            // 验证验证码
            const [codes] = await pool.query(
                'SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND expires_at > NOW() AND is_used = FALSE ORDER BY created_at DESC LIMIT 1',
                [phone, code]
            );

            if (codes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: '验证码无效或已过期'
                });
            }

            // 标记验证码为已使用
            await pool.query(
                'UPDATE verification_codes SET is_used = TRUE WHERE id = ?',
                [codes[0].id]
            );

            // 检查用户是否存在
            let [users] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
            let user = users[0];

            if (!user) {
                // 创建新用户
                const [result] = await pool.query(
                    'INSERT INTO users (phone) VALUES (?)',
                    [phone]
                );
                user = {
                    id: result.insertId,
                    phone
                };
            }

            // 生成JWT token
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    nickname: user.nickname,
                    avatarUrl: user.avatar_url
                }
            });
        } catch (error) {
            console.error('手机登录错误:', error);
            res.status(500).json({
                success: false,
                message: '登录失败',
                error: error.message
            });
        }
    }
};

module.exports = authController; 