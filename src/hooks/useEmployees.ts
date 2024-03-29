import { useCallback, useState } from "react";
import { Employee } from "../utils/types";
import { useCustomFetch } from "./useCustomFetch";
import { EmployeeResult } from "./types";

export function useEmployees(): EmployeeResult {
  const { fetchWithCache } = useCustomFetch();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true); 
    try {
      const employeesData = await fetchWithCache<Employee[]>("employees");
      setEmployees(employeesData);
    } catch (error) {
      
    } finally {
      setIsLoading(false); 
    }
  }, [fetchWithCache]);

  const invalidateData = useCallback(() => {
    setEmployees(null);
  }, []);

  return { data: employees, loading: isLoading, fetchAll, invalidateData }; // Use the new isLoading state
}
