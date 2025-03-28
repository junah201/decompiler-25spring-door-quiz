import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardEntry {
  rank: number;
  nickname: string;
  name: string;
  time: string;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, nickname: "Flag_out", name: "최승림", time: "0:00:15:37" },
  { rank: 2, nickname: "Soyoon", name: "윤소윤", time: "1:00:50:23" },
  { rank: 2, nickname: "vkdl", name: "안지율", time: "1:22:30:02" },
];

export default function Leaderboard() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">🏆 리더보드</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">순위</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead className="hidden md:table-cell">이름</TableHead>
              <TableHead className="text-right">풀이 시간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry) => (
              <TableRow key={entry.rank}>
                <TableCell className="text-center">{entry.rank}</TableCell>
                <TableCell>{entry.nickname}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {entry.name}
                </TableCell>
                <TableCell className="text-right">{entry.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
