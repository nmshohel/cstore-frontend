
async function yourDatabaseQueryToFetchUserData(mobileNo, password) {
  try {
    const options = { mobileNo, password }
    const resUser = await fetch(`http://localhost:5000/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(options),
    })
    const dataUser = await resUser.json();

    if (resUser.ok) {
      const { role, pbsCode, zonalCode, accessToken } = dataUser.data;
      const user = {
        mobileNo,
        role,
        accessToken,
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

export default yourDatabaseQueryToFetchUserData;