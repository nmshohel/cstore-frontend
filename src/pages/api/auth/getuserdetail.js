

async function yourDatabaseQueryToFetchUserDataDetail(mobileNo, accessToken) {
    try {
        // const options = { mobileNo }
        const resUser = await fetch(`http://localhost:5000/user/${mobileNo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Authorization: accessToken,
            },
        })
        const dataUser = await resUser.json();
        // //console.log(dataUser)
        if (resUser.ok) {
            const { email, role, pbs_code, zonal_code,image } = dataUser.data;
            const user = {
                email,
                role,
                pbs_code,
                zonal_code,
                image
            };

            return user;
        } else {
            console.error("Login failed:", dataUser.message);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

export default yourDatabaseQueryToFetchUserDataDetail;