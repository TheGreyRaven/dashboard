import useSWRImmutable from "swr/immutable";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/utils";
import { json } from "@codemirror/lang-json";
import { IconAlertTriangle } from "@tabler/icons-react";
import { andromeda } from "@uiw/codemirror-theme-andromeda";
import CodeMirror from "@uiw/react-codemirror";

const ViewPlayer = ({
  license,
  cid,
  dialogOpen,
  setDialogOpen,
}: {
  license: string;
  cid: number;
  dialogOpen: boolean;
  setDialogOpen: any;
}) => {
  const { data, isLoading, error } = useSWRImmutable(
    `/api/database/player/${license}/${cid}`,
    fetcher
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Character Overview</DialogTitle>
        </DialogHeader>
        <div className="mt-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <div>
            {isLoading && <Skeleton className="h-[200px]" />}

            {error && (
              <Alert className="border-red-600">
                <IconAlertTriangle className="h-4 w-4" color="red" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>
                  Failed to fetch character data.
                </AlertDescription>
              </Alert>
            )}
            {data && (
              <div>
                <CodeMirror
                  value={data}
                  height="500px"
                  extensions={[json()]}
                  theme={andromeda}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ViewPlayer };
