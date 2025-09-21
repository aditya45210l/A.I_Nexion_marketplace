import { useMemo, useState } from "react";
import Link from "next/link";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { SquareChevronRight } from "lucide-react";

// interface IData {
//   id: string;
//   name: string;
//   availability: 'online' | 'away' | 'busy' | 'offline';
//   avatar: string;
//   status: 'active' | 'inactive';
//   flag: string; // Emoji flags
//   email: string;
//   company: string;
//   role: string;
//   joined: string;
//   location: string;
//   balance: number;
// }

export interface IData {
  id: string;
  provider: string;
  //   availability: 'online' | 'away' | 'busy' | 'offline';
  model: string;
  status: "active" | "inactive" | "rented";
  lenderAddress: string; // Emoji flags
  BorrowerAddress: string;
  api_key?: string;
  api_total_calls?: number;
  revenue: number;
}

// const demoData: IData[] = [
//   {
//     id: '1',
//     name: 'Kathryn Campbell',
//     availability: 'online',
//     avatar: '1.png',
//     status: 'active',
//     flag: '🇺🇸',
//     email: 'kathryn@apple.com',
//     company: 'Apple',
//     role: 'CEO',
//     joined: '2021-04-15',
//     location: 'San Francisco, USA',
//     balance: 5143.03,
//   },
//   {
//     id: '2',
//     name: 'Robert Smith',
//     availability: 'away',
//     avatar: '2.png',
//     status: 'inactive',
//     flag: '🇬🇧',
//     email: 'robert@openai.com',
//     company: 'OpenAI',
//     role: 'CTO',
//     joined: '2020-07-20',
//     location: 'London, UK',
//     balance: 4321.87,
//   },
//   {
//     id: '3',
//     name: 'Sophia Johnson',
//     availability: 'busy',
//     avatar: '3.png',
//     status: 'active',
//     flag: '🇨🇦',
//     email: 'sophia@meta.com',
//     company: 'Meta',
//     role: 'Designer',
//     joined: '2019-03-12',
//     location: 'Toronto, Canada',
//     balance: 7654.98,
//   },
//   {
//     id: '4',
//     name: 'Lucas Walker',
//     availability: 'offline',
//     avatar: '4.png',
//     status: 'inactive',
//     flag: '🇦🇺',
//     email: 'lucas@tesla.com',
//     company: 'Tesla',
//     role: 'Developer',
//     joined: '2022-01-18',
//     location: 'Sydney, Australia',
//     balance: 3456.45,
//   },
//   {
//     id: '5',
//     name: 'Emily Davis',
//     availability: 'online',
//     avatar: '5.png',
//     status: 'active',
//     flag: '🇩🇪',
//     email: 'emily@sap.com',
//     company: 'SAP',
//     role: 'Lawyer',
//     joined: '2023-05-23',
//     location: 'Berlin, Germany',
//     balance: 9876.54,
//   },
//   {
//     id: '6',
//     name: 'James Lee',
//     availability: 'away',
//     avatar: '6.png',
//     status: 'active',
//     flag: '🇲🇾',
//     email: 'james@keenthemes.com',
//     company: 'Keenthemes',
//     role: 'Director',
//     joined: '2018-11-30',
//     location: 'Kuala Lumpur, MY',
//     balance: 6214.22,
//   },
//   {
//     id: '7',
//     name: 'Isabella Martinez',
//     availability: 'busy',
//     avatar: '7.png',
//     status: 'inactive',
//     flag: '🇪🇸',
//     email: 'isabella@bbva.es',
//     company: 'BBVA',
//     role: 'Product Manager',
//     joined: '2021-06-14',
//     location: 'Barcelona, Spain',
//     balance: 5321.77,
//   },
//   {
//     id: '8',
//     name: 'Benjamin Harris',
//     availability: 'offline',
//     avatar: '8.png',
//     status: 'active',
//     flag: '🇯🇵',
//     email: 'benjamin@sony.jp',
//     company: 'Sony',
//     role: 'Marketing Lead',
//     joined: '2020-10-22',
//     location: 'Tokyo, Japan',
//     balance: 8452.39,
//   },
//   {
//     id: '9',
//     name: 'Olivia Brown',
//     availability: 'online',
//     avatar: '9.png',
//     status: 'active',
//     flag: '🇫🇷',
//     email: 'olivia@lvmh.fr',
//     company: 'LVMH',
//     role: 'Data Scientist',
//     joined: '2019-09-17',
//     location: 'Paris, France',
//     balance: 7345.1,
//   },
//   {
//     id: '10',
//     name: 'Michael Clark',
//     availability: 'away',
//     avatar: '10.png',
//     status: 'inactive',
//     flag: '🇮🇹',
//     email: 'michael@eni.it',
//     company: 'ENI',
//     role: 'Engineer',
//     joined: '2023-02-11',
//     location: 'Milan, Italy',
//     balance: 5214.88,
//   },
//   {
//     id: '11',
//     name: 'Ava Wilson',
//     availability: 'busy',
//     avatar: '11.png',
//     status: 'active',
//     flag: '🇧🇷',
//     email: 'ava@vale.br',
//     company: 'Vale',
//     role: 'Software Engineer',
//     joined: '2022-12-01',
//     location: 'Rio de Janeiro, Brazil',
//     balance: 9421.5,
//   },
//   {
//     id: '12',
//     name: 'David Young',
//     availability: 'offline',
//     avatar: '12.png',
//     status: 'active',
//     flag: '🇮🇳',
//     email: 'david@tata.in',
//     company: 'Tata',
//     role: 'Sales Manager',
//     joined: '2020-03-27',
//     location: 'Mumbai, India',
//     balance: 4521.67,
//   },
// ];

export default function SubscriptionTable({
  type,
  data: demoData,
}: {
  type: "lender" | "borrower";
  data: IData[];
}) {
  console.log("data from table: ",demoData);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: true },
  ]);
  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: "provider",
        header: "Provider",
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
        size: 100,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "lenderAddress",
        header: "Lender",
        cell: (info) => (
          // <Link href={`mailto:${info.getValue()}`} className="hover:text-primary hover:underline">
          //   {info.getValue() as string}
          // </Link>
          <div>
            {" "}
            <CopyAddress
              text={formatAddress(info.getValue() as Address)}
              copyText={info.getValue() as string}
            />
          </div>
        ),
        size: 100,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "BorrowerAddress",
        header: "Borrower",
        cell: (info) => (
          <div>
            {" "}
            <CopyAddress
              text={formatAddress(info.getValue() as Address)}
              copyText={info.getValue() as string}
            />
          </div>
        ),
        size: 100,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "api_total_calls",
        header: "Total Calls",
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
        size: 100,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
        size: 75,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "revenue",
        header: "Revenue($)",
        cell: (info) => (
          <span className="font-semibold">
            ${(info.getValue() as number).toFixed(2)}
          </span>
        ),
        size: 75,
        meta: {
          headerClassName: "text-right rtl:text-left",
          cellClassName: "text-right rtl:text-left",
        },
      },
      {
        accessorKey: "more",
        header: "More",
        cell: (info) => (
          <span className="font-semibold flex justify-end">
            <Link href={"#"}>
              <SquareChevronRight size={16} />
            </Link>
          </span>
        ),
        size: 65,
        meta: {
          headerClassName: "text-right rtl:text-left",
          cellClassName: "text-right rtl:text-left",
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} recordCount={demoData?.length || 0}>
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  );
}
import { Code } from "@/components/ui/code";
import { type Address } from "thirdweb";

export function CopyAddress({
  text,
  copyText,
}: {
  text: string;
  copyText: string;
}) {
  return (
    <Code showCopyButton copyText={copyText} variant={"default"} size={"sm"}>
      {text}
    </Code>
  );
}

export const formatAddress = (address: Address) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;
