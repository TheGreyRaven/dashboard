import { signIn } from "../api/auth/[...nextauth]/auth";

const SignIn = async () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("discord", { callbackUrl: "/" });
        }}
      >
        <button>Sign in with Discord</button>
      </form>
    </div>
  );
};

export default SignIn;
