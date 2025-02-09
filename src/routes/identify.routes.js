const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/identify', async (req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Email or phoneNumber is required" });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM Contact WHERE email = $1 OR phoneNumber = $2`,
            [email, phoneNumber]
        );

        let contacts = result.rows;
        if (contacts.length === 0) {
            const insertResult = await pool.query(
                `INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES ($1, $2, 'primary') RETURNING *`,
                [email, phoneNumber]
            );
            contacts = insertResult.rows;
        }

        const primaryContact = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];
        const secondaryContacts = contacts.filter(c => c.linkPrecedence === 'secondary');

        res.status(200).json({
            contact: {
                primaryContactId: primaryContact.id,
                emails: [...new Set(contacts.map(c => c.email).filter(Boolean))],
                phoneNumbers: [...new Set(contacts.map(c => c.phoneNumber).filter(Boolean))],
                secondaryContactIds: secondaryContacts.map(c => c.id),
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
