import jwt from 'jsonwebtoken';

const generateToken = (mobile) => {
    return jwt.sign({ mobile }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// ફાયરબેઝ દ્વારા સફળતાપૂર્વક વેરિફાઈ થયેલા યુઝરને સેશન આપવું
export const firebaseLogin = async (req, res) => {
    const { mobile, uid } = req.body;

    if (!mobile || !uid) {
        return res.status(400).json({ success: false, message: "અધૂરી વિગતો છે ભાઈ!" });
    }

    try {
        const token = generateToken(mobile);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: uid,
                name: `Aspirant-${mobile.slice(-4)}`,
                mobile: mobile,
                role: 'Aspirant'
            }
        });
    } catch (error) {
        console.error("Firebase Auth Backend Error:", error);
        res.status(500).json({ success: false, message: "સર્વર વેરિફિકેશન લોચો!" });
    }
};