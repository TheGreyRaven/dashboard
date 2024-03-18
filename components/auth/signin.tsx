import { signIn } from "@/app/api/auth/[...nextauth]/auth";
import { IconAlertTriangle, IconBrandDiscord } from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const AuthSignIn = async ({
  provider = "discord",
  callbackUrl = "/dashboard",
}) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card>
        <CardHeader className="items-center">
          <h1 className="text-lg">Welcome to Bygden</h1>
          <p className="text-sm text-stone-400 mb-8">
            To continue, please sign in!
          </p>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn(provider, { redirectTo: callbackUrl });
            }}
          >
            <Button variant="outline" className="w-full">
              <IconBrandDiscord className="mr-2" /> Sign in with{" "}
              {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Alert>
            <IconAlertTriangle className="h-4 w-4" color="rgb(220 38 38)" />
            <AlertTitle className="text-sm">Heads up!</AlertTitle>
            <AlertDescription>
              <p className="text-xs">
                You need to be a staff member to sign in
              </p>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
};

export { AuthSignIn };
