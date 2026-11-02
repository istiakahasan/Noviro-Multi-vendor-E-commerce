"use client";

import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="text-sm text-muted-foreground mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

        {/* Mobile */}
        <div className="flex sm:hidden gap-2 w-full justify-center">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>

        {/* Desktop: Previous */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="hidden sm:block"
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-9 h-9"
              >
                {page}
              </Button>
            );
          })}

          {totalPages > 3 && (
            <>
              <span className="px-2 hidden sm:inline">...</span>
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-9 h-9 hidden sm:inline"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* Desktop: Next */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="hidden sm:block"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
