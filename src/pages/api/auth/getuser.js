
async function yourDatabaseQueryToFetchUserData(email, password) {
  try {
    const options = {
      email,
      password
    };

    const resUser = await fetch(`http://localhost:5000/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Corrected header name
      },
      body: JSON.stringify(options),
    });

    const dataUser = await resUser.json();

    if (dataUser.data) {
      const {
        email,
        role,
        pbs_code,
        zonal_code,
        displayName,
        image
      } = dataUser.data;
      const user = {
        email,
        role,
        displayName,
        pbs_code,
        zonal_code,
        image
      };
      console.log(user)
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