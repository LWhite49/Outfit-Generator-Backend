import { AppMain } from "./AppMain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={client}>
			<AppMain />
		</QueryClientProvider>
	);
};

export default App;
