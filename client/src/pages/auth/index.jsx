import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import loadingGif from "@/assets/loading.gif";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setIsLoading(true);
      try {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (res.data.user.id) {
          setUserInfo(res.data.user);
          if (res.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Invalid email or password");
        } else {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleSignup = async () => {
    if (validateSignup()) {
      setIsLoading(true);
      try {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (res.status === 201) {
          setUserInfo(res.data.user);
          navigate("/profile");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Email already exists");
        } else {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-[100vh]  flex items-center justify-center">
      <div className="max-w-md h-[80vh] bg-white border-1 border-white text-opacity-90 w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">TawkTalk</h1>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-full " defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-1/2 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-1/2 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="Email"
                  className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="Password"
                  className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="ease-out transition-all duration-150 active:scale-[98%] transform bg-blue-600 disabled:opacity-100 hover:bg-blue-800 mt-4 w-full rounded p-3 text-white shadow"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  <img
                    src={loadingGif}
                    alt="Loading"
                    className={`h-6 w-6 opacity-50 ${
                      isLoading ? "block" : "hidden"
                    }`}
                  />
                  <span className={`${isLoading ? "hidden" : "block"}`}>
                    Login
                  </span>
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="Email"
                  className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="Password"
                  className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="Password"
                  className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="ease-out transition-all duration-150 active:scale-[98%] transform bg-blue-600 disabled:opacity-100 hover:bg-blue-800 mt-4 w-full rounded p-3 text-white shadow"
                  onClick={handleSignup}
                  disabled={isLoading}
                >
                  <img
                    src={loadingGif}
                    alt="Loading"
                    className={`h-6 w-6 opacity-50 ${
                      isLoading ? "block" : "hidden"
                    }`}
                  />
                  <span className={`${isLoading ? "hidden" : "block"}`}>
                    Signup
                  </span>
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
