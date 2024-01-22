import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeesLoading } = useEmployees()
  const { data: paginatedTransactions, fetchMore, ...paginatedTransactionsUtils } = usePaginatedTransactions();

  // const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [isFilteredByEmployee, setIsFilteredByEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); 

  const handleEmployeeSelection = async (newValue:Employee | null) => {
    if (newValue === null || newValue.id === EMPTY_EMPLOYEE.id) {
      await loadAllTransactions();
      setIsFilteredByEmployee(false); // Not filtered by employee
      setSelectedEmployee(null);
    } else {
      await loadTransactionsByEmployee(newValue.id);
      setIsFilteredByEmployee(true); // Filtered by employee
      setSelectedEmployee(newValue);
    }
  };

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()

    await employeesLoading.fetchAll()
    await paginatedTransactionsUtils.fetchAll()

    setIsLoading(false)
  }, [employeesLoading, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadMoreTransactions = useCallback(async () => {
    setIsLoading(true);
    await fetchMore();
    setIsLoading(false);
  }, [fetchMore]);

  
  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeesLoading.loading) {
      loadAllTransactions()
    }
  }, [employeesLoading.loading, employees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
            isLoading={employeesLoading.loading}
          defaultValue={selectedEmployee ?? EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={handleEmployeeSelection
            }
    
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {transactions !== null && !isFilteredByEmployee && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={loadMoreTransactions}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
