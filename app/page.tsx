import { auth, signOut } from "./api/auth/[...nextauth]/auth";

const Home = async () => {
  const session = await auth();

  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button>Sign out</button>
    </form>
  );
};

export default Home;
