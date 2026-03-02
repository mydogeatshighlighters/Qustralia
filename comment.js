const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    // This grabs the "Connection String" from your Netlify Environment Variables
    const sql = neon(process.env.DATABASE_URL); 

    try {
        if (event.httpMethod === 'POST') {
            const { username, content } = JSON.parse(event.body);
            // Insert the comment into your Neon table
            await sql`INSERT INTO comments (username, content) VALUES (${username}, ${content})`;
            return { 
                statusCode: 200, 
                body: JSON.stringify({ message: "Success" }) 
            };
        } 

        // Get all comments, newest first
        const rows = await sql`SELECT * FROM comments ORDER BY created_at DESC`;
        return { 
            statusCode: 200, 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rows) 
        };
    } catch (error) {
        console.error("Database Error:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};
