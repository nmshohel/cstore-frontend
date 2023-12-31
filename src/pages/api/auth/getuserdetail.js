

async function yourDatabaseQueryToFetchUserDataDetail(mobileNo, accessToken) {
    try {
        // const options = { mobileNo }
        const resUser = await fetch(`https://computer-management-backend-iiscez3bd-nmshohel.vercel.app/api/v1/user/user/${mobileNo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: accessToken,
            },
        })
        const dataUser = await resUser.json();
        // //console.log(dataUser)
        if (resUser.ok) {
            const { mobileNo, role, pbsCode, zonalCode, employee } = dataUser.data;
            const user = {
                name: employee.name,
                photoUrl: employee.photoUrl,
                mobileNo,
                role,
                pbs_code: pbsCode,
                zonal_code: zonalCode,
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