
import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ojfuwp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: '1', // Update this to a non-deprecated version
    strict: true,
    deprecationErrors: true,
  },
});

async function yourDatabaseQueryToFetchUserData(iemail) {
    try {
      await client.connect();
    // Assuming you have a MongoDB collection named 'users'
   const userCollection = client.db('pbs-office-information').collection('activitiesusers');
    const user = await userCollection.findOne({ email:iemail });
    if (!user) {
      // User not found
      return null;
    }

    // Extract the necessary user data, including roles, from the 'user' object
    const { name, email, role,zonal_code,pbs_code} = user;

    // Return the user data as an object
    return { name, email, role,zonal_code,pbs_code };
  } catch (error) {
    // Handle any errors that might occur during the database query
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default yourDatabaseQueryToFetchUserData;