import { ConnectButton } from "@/src/components/connectButton";

export const Home = () => {
  return (
    <section className="h-full flex justify-center items-center flex-grow">
      <div className="flex items-center min-h-screen bg-gray-100 w-full">
        <div className="container mx-auto">
          <div className="max-w-lg mx-auto my-10">
            <div className="m-7">
              <div className="relative p-8 bg-white shadow-sm sm:rounded-xl">
                <div className="text-center">
                  <h1 className="my-3 text-3xl font-semibold text-gray-700 ">
                    Welcome to E-Voting
                  </h1>
                  <p className="text-gray-500 ">
                    Connect Wallet to access your account
                  </p>
                </div>

                <div className="w-full mt-5">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
