import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getCars, getCarById, getAllCars, addCar } from "../services/service";

export const carKeys = {
  all: ["cars"],
  list: (params) => ["cars", "list", params],
  detail: (id) => ["cars", "detail", String(id)],
  everything: ["cars", "all"],
};

export function useCars(params) {
  return useQuery({
    queryKey: carKeys.list(params),
    queryFn: ({ signal }) => getCars({ ...params, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useCar(id) {
  return useQuery({
    queryKey: carKeys.detail(id),
    queryFn: ({ signal }) => getCarById(id, signal),
    retry: (failureCount, error) =>
      error.code !== "NOT_FOUND" && failureCount < 1,
  });
}

export function useAllCars() {
  return useQuery({
    queryKey: carKeys.everything,
    queryFn: ({ signal }) => getAllCars(signal),
  });
}

export function useAddCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: carKeys.all }),
  });
}