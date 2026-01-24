'use server'
const postUsers = async (email: string) => {
    try {
        const response = await fetch(`${process.env.WEB_PUBLIC_BACKEND_API_URL}/auth/join-waitlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
        })
    })
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something went wrong');

    return { success: true }
    } catch (error) {
            return { success: false, error: String(`${error}, Please try again later.`) }
    }
}

export default postUsers
