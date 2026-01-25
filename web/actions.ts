'use server'
const postUsers = async (email: string) => {
    try {
        console.log("Api: ", `${process.env.WEB_PUBLIC_BACKEND_API_URL}/auth/join-waitlist`);
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

        return { success: true, message: data.message || "Something went wrong" }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

export default postUsers
