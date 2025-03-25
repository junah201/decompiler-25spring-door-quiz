import { ExternalLink } from "lucide-react";
import { useQueryClient } from "react-query";

import { solve } from "@/api/main";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTE_MAP } from "@/constants";
import { ControlType, FormInputType, INPUT } from "@/constants/form";
import { useCustomForm } from "@/hooks/useCustomForm";
import { useCustomMutation } from "@/hooks/useCustomQuery";

export default function Main() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useCustomForm({});

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useCustomMutation(solve, {
    SuccessRedirect: ROUTE_MAP.ANSWER,
    onSuccess: (res) => {
      queryClient.setQueryData("password", res.password);
    },
    SuccessMessage: "Correct Answer",
    ErrorMessage: "Wrong Answer",
  });

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">디컴파일러 25Spring 문 비번</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Question
          title="session-basic"
          description="쿠키와 세션으로 인증 상태를 관리하는 간단한 로그인 서비스입니다. admin 계정으로 로그인에 성공하면 플래그를 획득할 수 있습니다."
          link="https://dreamhack.io/wargame/challenges/409"
          control={control}
          inputFlags={INPUT.FLAG1}
        />
        <Question
          title="basic_exploitation"
          description="이 문제는 서버에서 작동하고 있는 서비스(basic_exploitation_000)의 바이너리와 소스 코드가 주어집니다. 프로그램의 취약점을 찾고 익스플로잇해 셸을 획득한 후, 'flag' 파일을 읽으세요. 'flag' 파일의 내용을 워게임 사이트에 인증하면 점수를 획득할 수 있습니다."
          link="https://dreamhack.io/wargame/challenges/2"
          control={control}
          inputFlags={INPUT.FLAG2}
        />
      </div>
      <Button
        className="w-full max-w-md"
        disabled={isSubmitting || isLoading || Object.keys(errors).length > 0}
        onClick={handleSubmit((data) => {
          mutate(data);
        })}
      >
        정답 제출
      </Button>
      <div className="flex flex-col break-keep text-sm text-gray-500 ">
        <p>
          이 사이트의 소스코드는{" "}
          <a
            href="https://github.com/junah201/decompiler-25spring-door-quiz"
            target="_blank"
            className="text-blue-500 hover:underline space-x-2"
          >
            Github
          </a>
          에서 확인할 수 있습니다.
        </p>
        <p>
          모든 정답을 시도해보는 브루스포스 방식을 제외한 어떠한 방식으로 문제를
          푸셔도 좋습니다.
        </p>
      </div>
    </div>
  );
}

interface QuestionProps {
  title: string;
  description: string;
  link: string;
  control: ControlType;
  inputFlags: FormInputType;
}

const Question = ({
  title,
  description,
  link,
  control,
  inputFlags,
}: QuestionProps) => {
  return (
    <Card className="w-full max-w-md flex flex-col content-between break-keep">
      <CardHeader>
        <CardTitle>
          <a
            href={link}
            target="_blank"
            className="text-blue-500 hover:underline flex space-x-2"
          >
            <span>{title}</span>
            <ExternalLink />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="flex-grow">{description}</p>
        <Input control={control} {...inputFlags} />
      </CardContent>
    </Card>
  );
};
