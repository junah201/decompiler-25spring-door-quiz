import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTE_MAP } from "@/constants";

export default function Answer() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const password = queryClient.getQueryData("password") as string | undefined;

  return (
    <div className="flex flex-col items-center gap-6 p-6 break-keep">
      <h1 className="text-2xl font-bold">정답 확인</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>문 비밀번호</CardTitle>
        </CardHeader>
        <CardContent>
          {password ? (
            <p className="text-lg font-semibold">{password}</p>
          ) : (
            <p className="text-gray-500">제출된 정답이 없습니다.</p>
          )}
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>추가 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <p>동방은 C521에 있습니다.</p>
          <p>방문 전 임원진 중 한 명에게 비밀번호가 맞는지 확인해 주세요.</p>
        </CardContent>
      </Card>
      <Button
        className="w-full max-w-md"
        onClick={() => navigate(ROUTE_MAP.MAIN)}
      >
        돌아가기
      </Button>
    </div>
  );
}
