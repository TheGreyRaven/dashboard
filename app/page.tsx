import { AuthSignIn } from "@/components/auth";

const SignIn = async (props: any) => {
  const error = props.searchParams?.error ?? undefined;
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <AuthSignIn error={error} />
      </div>
    </>
  );
};

export default SignIn;
