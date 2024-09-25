export default function useUsers(config) {
  const [count, setCount] = React.useState(11);
  const [page, setPage] = React.useState(1);

  console.log(import.meta.env.VITE_PUBLIC_API_URL);
  const { data, isLoading, error, mutate } = useSWR(
    `${import.meta.env.VITE_PUBLIC_API_URL}/users/?page=${page}&count=${count}&order=asc${config && config.role ? `&role=${config.role}` : ""}`,
    getAllUsers,
  );

  console.log(count, page);
  const goToNextPage = () => {
    const { total } = data;

    if (page * count < total) {
      setPage((prevPage) => prevPage + 1);
      return;
    }
  };

  const goToPrevPage = () => {
    if (page < 1) {
      setPage((prevPage) => prevPage - 1);
      return;
    }
  };

  const changeCount = (val) => setCount(val);
  const helpers = {
    goToPrevPage,
    goToNextPage,
    changeCount,
  };

  return { data, isLoading, error, mutate, helpers, count, page };
}
