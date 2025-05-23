import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APP_WRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APP_WRITE_PROJECT_ID;
const COLLECTION_ID = import.meta.env.VITE_APP_WRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);
const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  console.log(
    "DATABASE_ID",
    DATABASE_ID,
    "\n PROJECT_ID",
    PROJECT_ID,
    "\n COLLECTION_ID",
    COLLECTION_ID
  );

  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    if (result.documents.length > 0) {
      const documentId = result.documents[0].$id;
      const searchCount = result.documents[0].count + 1;
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, {
        count: searchCount,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movieId: movie.id,
        posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {}
};

export const getTrendingMovies = async () => {
  const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.limit(5),
    Query.orderDesc("count"),
  ]);
  console.log("Fetched search count:", response);
  return response.documents;
};
