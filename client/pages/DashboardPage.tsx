import { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/DashboardTopBar";
import ProjectCard from "../components/ProjectCard";
import { Plus, ChevronDown } from "lucide-react";

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    title: "Website Redesign Q4",
    description: "Complete overhaul of the marketing website.",
    status: "uphill" as const,
    avatars: [
      {
        id: 1,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-d1X8Nef3SoqG64WHqdvJ0H7-v4qu0PIBaU9HtlhL6d5qR3CrCVyJK_VEfFT92MAx2hJLVaYlsB4tpT8Xt4Y6Ic6NrFq83bNMdskopNABOVQD_Pa_d5jETUlKW-rVlb2ijBkJ1W7sw5hSpP_jt6SfnmS1pzAV81GOpM9Wij3LX8IXsRu2vPbUkysoFJRPFh87qfnQzhQSmI1ebOBRTovtLDlVggUntuo4RvB7_XuVRPZFwXpGhuf5BDMAZ2KxU8P8Dt9UjdnVBWdo",
        alt: "Team member 1",
      },
      {
        id: 2,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8KnI2vauidEC6TQtLCyjfOpH3HeA_DX-Dvajx7Xkv8GAWqMoqHTxiGgaJ0hhiwXumIdVfsz1XQCKvHLUG3ZLkz3N3Y_kyeCQdlltZxvl-IfFyB9ofkcELnIQpAQHb_ncUn97TiPhgwK1mbQhtN7A2XgyKVhXsXr3tjssAMVOgTAv_l-cXp_3U5EM3fY7rJZhGgXh0tyaaogaA_eSl83bUiR217LJITziDgL89k4Fl89DcGkIUAQJLMd_LGZF4zSl0fSI_pOUXzshm",
        alt: "Team member 2",
      },
      {
        id: 3,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC62HlIyfagyfv-_JA2DEg_3SqAocqHh9wkBhWj6_VOUVmzUV6hBWDfPMGB-PqQb2fXOt-SUiM80am9FiSRwWlITluX4subX3fG3-0CffgUiFTr7JeV8sn-c2FDVLo6qULdmyvOGGkya36LT8LMw2zflB_4LLg37mOV3KHiMUzOaRFYyQbXQsBHgid9OPBXfph1qv4t0UIjlgd5N0ct1DeCdYI8or3Sn1RORC5hdOlCNzMFZ0qRGX3tV6d_6c0YWE92rfWbBCOgJ8Ee",
        alt: "Team member 3",
      },
    ],
    dueDate: "Due in 2 weeks",
  },
  {
    id: 2,
    title: "Mobile App Launch",
    description: "iOS and Android app development and release.",
    status: "peak" as const,
    avatars: [
      {
        id: 4,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaLwKl2Ts32MJBUI2ofNrl4P_izysJOxQS4er0v0Way1NUr6JkacYAhkzBfx3IumRHnfoM7ZfNmr7BrLxHkSAJAsae7wlqIrrOn7FKYaVl-DfdiQINLVEO3SsBPF-Q4by6TsPq7ODp-LteWdvCzz8vjpJY7j609xnwHhJKF1J1PqkG-RjLcmTWPA2oqlqfuymx7AsKo8DS592qU8Ytvx_MgasUXrOMofdGAgMlg8uoUTIYvg1vqAKGla-mZITQNVxz7u-5NKnp3VwG",
        alt: "Team member 4",
      },
      {
        id: 5,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRNMzqUUdEc6Wgs_Me6Etyz6tkXnrXEWdpbctLgS5ziU0TYDCa16ZftMTgMuxZk23ANmVO7qiwpQrd3j6m_Ci9ouW_8KwYeMXi4DVPBsHIUPCTp-kns93h-Pwok3FFt7C_BHUlFaNcS6FtiJU3EUp5AIGtuTS1iAu8t7pVGKeUT0jNiHU9e8u5OqoTOg6rMBLz8rJzmwUMAHyo1KtuRcQrzbNayh6uafAgBbGrx6zHtlnz-Uf-TpcNKmfNMo4xkxLcLzBqC5Ycu5zM",
        alt: "Team member 5",
      },
    ],
    dueDate: "Due in 1 month",
  },
  {
    id: 3,
    title: "2024 User Conference",
    description: "Planning and execution of the annual user event.",
    progress: 80,
    avatars: [
      {
        id: 6,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMRt_eK9Oo7mxNnLflSAl4VfdqxN0ibvx5VGXrZyE29Tc2tZMZWd1sZZww4lqRN5IymXpiewIXwOl34fSIpljWd0uZ33BbC1q4CDvZmj5PVKWAF3yfcF6CR1_qtCyVZ9vF-AsG8-XviP15yo5FXqDXZFe0rokB-O4pI-Gag0RqM84F1iK9AehYmP9NhRjYQejxPIyi-ypXTG6vLK-g_X8wH6ZZH-3CfLC1eUlPD8E1H9CeqbIXDU6QF7QpxX62VFhh-3ACTf3Cn9Ai",
        alt: "Team member 6",
      },
      {
        id: 7,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBH6sGxW6OvxoRmvK77zOSM9XB4YuhuK7ax2qR42gVBxquHDm81MwyNRU2YqnfMq8p547niYsmVFBlZJZJweZSFifBEjwSz-f0w_LLf1xAyIyS67jzALO7ejiPt4C2SeD1MSj_QuRSjKxuO7gnYf54O-7k0xkou-8Fb9gUYcTQ5LcN9vLgbz1CXgObE7mRwBHJPeutjcumbyNvvej1jCWY_RIuFPp3Ssj0K5Awq1d-F3N7cuXqD7lFmTe7XnJYPuo7RbTxb-OLLFGd",
        alt: "Team member 7",
      },
      {
        id: 8,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf1kYWUlRdfp-KJ0-y-HZkWvm-fNyNvoQ2dKp4dBVoe1d0WVBp_Cr_jSlPu_TENMJN7ySqoHqSThnmoeeeqUhpUgvlfJ4io0bK8Fg5L6EPUXSCDiiqBD96tEeO8txbK9rz06nBE6pXRHEt-7e2AVK_vJmFl3FsJXIUrch2tKdZdwrwHgLF5kCYLZa1WE5w32VtZ4GjMj4dH4ZqClzohJ_9OgLwzWvXdM6JpheU6ZF9wx_eCY5pHKP5InfropbDngxZajZkLbx6WZmK",
        alt: "Team member 8",
      },
    ],
    dueDate: "Due in 3 months",
  },
  {
    id: 4,
    title: "API Integration",
    description: "Connect with third-party data providers.",
    status: "downhill" as const,
    avatars: [
      {
        id: 9,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUpb5aTRskFmDVOvvwPOuyZh7ZyXaNhQhT7uD7hRQVXtu1IZZfSlfArECL2gAex0vTLOObajtNxBozrQk04ZIjLNgVAQiKe_9QNk4TAJbHVY8GxUkj7uxRomNjBGRBXW6IV2zvtXc0AmEi9vUR8clrfhYhef_s4SD7Tx1gfknjbvoKeJmp_0GY7F0F8AVFsXfDXwWlLGe7W0d0ZQMFvYHTXkOWwqoxW0ihDpNcbYF4KK6RJbtRVJ6VWvr6-pLzRmPBYxlafM4s1NtT",
        alt: "Team member 9",
      },
      {
        id: 10,
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi_U-KwDSf6Yf8RdsbhkB-XizP1YoC1qQExkJyfB_EAnci_UUVYU8rXuIxt9riQroMdSgPnxFMz1rkvOXZXn1BVbe-9fzKIish6qEWSuFjeYjUnAYxZLChJSgi7qqK6YKlPGZK6LnponX3UrW9QSO0O2Ymq80wkfzWhJkQrma7N_SYYQAvZUl2RQS3-1QHkyKBztQctfMAMVO7Xu3bk3S8ouIZnY4iwL0iIdOAy8y0uKSKxQhkVVa62QGjqdkWFc6k6Wev1HcVBBMG",
        alt: "Team member 10",
      },
    ],
    dueDate: "Due in 1 week",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleProjectClick = (id: string | number) => {
    navigate(`/projects/${id}`);
  };

  const handleProjectMenuClick = (id: string | number) => {
    console.log("Menu clicked for project:", id);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar */}
        <DashboardTopBar onSearchChange={setSearchQuery} />

        {/* Page Content */}
        <div className="flex-1 p-10">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold tracking-tight">
              All Projects
            </h2>
            <button className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors">
              <Plus size={20} />
              <span className="truncate">Add New Project</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:border-blue-500/50 transition-colors">
              <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                Sort: Last Updated
              </p>
              <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-blue-500/20 border border-blue-500/50 px-3">
              <p className="text-blue-500 text-sm font-medium">Status: Active</p>
              <ChevronDown size={16} className="text-blue-500" />
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:border-blue-500/50 transition-colors">
              <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                Filter: Archived
              </p>
              <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
                onClick={handleProjectClick}
                onMenuClick={handleProjectMenuClick}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
