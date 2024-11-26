import {
  Await,
  createFileRoute,
  defer,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  History,
  MoreHorizontal,
  Search,
  Share,
  Trash2,
} from 'lucide-react';
import { Suspense, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSession } from '@/lib/generatedApi';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/sessions/')({
  component: Sessions,
  loader: async () => {
    const userAttributes = await fetchUserAttributes();
    const sessions = getSession({ userId: userAttributes.sub ?? '' });
    return { sessions: defer(sessions) };
  },
});

const TABLE_HEADERS = [
  '転送状況',
  '会話タイトル',
  '開始日時',
  '更新日時',
  '詳細',
];

function Sessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { sessions: sessionsFromApi } = useLoaderData({ from: '/sessions/' });

  const navigate = useNavigate();

  return (
    <>
      <div className="container mx-auto py-10 max-sm:px-3">
        <h1 className="mb-6 text-2xl font-bold">会話履歴</h1>
        <div className="relative mb-4 flex gap-3 max-md:flex-col">
          <Input
            type="text"
            placeholder="会話を検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <DatePickerWithRange
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>

        <h2 className="my-4 pt-4 text-lg font-semibold">自分の会話</h2>
        <Table>
          <TableHeader>
            <TableRow>
              {TABLE_HEADERS.map((header) => (
                <TableHead className="whitespace-nowrap" key={header}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense fallback={<LoadingTr />}>
              <Await promise={sessionsFromApi}>
                {(data) => {
                  const sessions = data.sessions;
                  const filteredConversations = sessions.filter((session) => {
                    const matchesSearchTerm = session.sessionTitle
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                    const updatedAtDate = new Date(session.updatedAt);

                    const fromDate = dateRange?.from
                      ? new Date(dateRange.from)
                      : null;
                    const toDate = dateRange?.to
                      ? new Date(dateRange.to)
                      : null;

                    // Adjust the toDate to include the entire day
                    if (toDate) {
                      toDate.setHours(23, 59, 59, 999);
                    }

                    const withinDateRange =
                      (!fromDate || updatedAtDate >= fromDate) &&
                      (!toDate || updatedAtDate <= toDate);

                    return matchesSearchTerm && withinDateRange;
                  });

                  return (
                    <>
                      {filteredConversations.map((conversation) => (
                        <TableRow
                          key={conversation.sessionId}
                          // TODO: navigate to detail page
                          onClick={() =>
                            navigate({
                              to: `/session/${conversation.sessionId}`,
                            })
                          }
                        >
                          <TableCell className="whitespace-nowrap">
                            {conversation.isEscalated ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                転送済み
                              </span>
                            ) : (
                              <span className="flex items-center text-orange-500">
                                <Clock className="mr-2 h-4 w-4" />
                                未転送
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {conversation.sessionTitle}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(
                              new Date(conversation.createdAt),
                              'yyyy/MM/dd HH:mm',
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(
                              new Date(conversation.updatedAt),
                              'yyyy/MM/dd HH:mm',
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Popover>
                              <PopoverTrigger
                                onClick={(event) => event.stopPropagation()}
                                className="my-2"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </PopoverTrigger>
                              <PopoverContent
                                onClick={(event) => event.stopPropagation()}
                                className="flex w-auto flex-col items-start p-2"
                              >
                                <Button
                                  variant="ghost"
                                  onClick={() => console.log('show details')}
                                >
                                  <Share size={18} className="mr-2" />
                                  転送する
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => console.log('show details')}
                                >
                                  <History size={18} className="mr-2" />
                                  会話を見る
                                </Button>
                                <Button
                                  variant="primaryGhost"
                                  onClick={() => console.log('show details')}
                                  className="text-primary"
                                >
                                  <Trash2 size={18} className="mr-2" />
                                  削除
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </TableBody>
        </Table>
        <h2 className="my-4 text-lg font-semibold">自分に転送された会話</h2>
        <Table>
          <TableHeader>
            <TableRow>
              {TABLE_HEADERS.map((header) => (
                <TableHead className="whitespace-nowrap" key={header}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense fallback={<LoadingTr />}>
              <Await promise={sessionsFromApi}>
                {(data) => {
                  const sessions = data.escalatedSessions;
                  const filteredConversations = sessions.filter((session) => {
                    const matchesSearchTerm = session.sessionTitle
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                    const updatedAtDate = new Date(session.updatedAt);

                    const fromDate = dateRange?.from
                      ? new Date(dateRange.from)
                      : null;
                    const toDate = dateRange?.to
                      ? new Date(dateRange.to)
                      : null;

                    // Adjust the toDate to include the entire day
                    if (toDate) {
                      toDate.setHours(23, 59, 59, 999);
                    }

                    const withinDateRange =
                      (!fromDate || updatedAtDate >= fromDate) &&
                      (!toDate || updatedAtDate <= toDate);

                    return matchesSearchTerm && withinDateRange;
                  });
                  return (
                    <>
                      {filteredConversations.map((conversation) => (
                        <TableRow
                          key={conversation.sessionId}
                          onClick={() =>
                            navigate({
                              to: `/session/${conversation.sessionId}`,
                            })
                          }
                        >
                          <TableCell className="whitespace-nowrap">
                            {conversation.isEscalated ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                転送済み
                              </span>
                            ) : (
                              <span className="flex items-center text-orange-500">
                                <Clock className="mr-2 h-4 w-4" />
                                未転送
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {conversation.sessionTitle}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(
                              new Date(conversation.createdAt),
                              'yyyy/MM/dd HH:mm',
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(
                              new Date(conversation.updatedAt),
                              'yyyy/MM/dd HH:mm',
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => console.log('show details')}
                              className="p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function DatePickerWithRange({
  dateRange,
  setDateRange,
  className,
}: {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[250px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'yyyy/MM/dd')} -{' '}
                  {format(dateRange.to, 'yyyy/MM/dd')}
                </>
              ) : (
                format(dateRange.from, 'yyyy/MM/dd')
              )
            ) : (
              <span>会話の更新日時で絞り込み</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function LoadingTr() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <TableRow key={index}>
          {TABLE_HEADERS.map((header) => (
            <TableCell key={header} className="text-center">
              <Skeleton className="h-10 w-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
