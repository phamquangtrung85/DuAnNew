"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Input from "./Input";
import Button from "./Button";
import AuthSocialButton from "./AuthSocialButton";

type Variant = "LOGIN" | "REGISTER";

const AuthForm: React.FC = () => {
  const session = useSession();
  const route = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      axios.post('/api/register', data)
      .then(() => signIn('credentials', data))
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
    } else if (variant === "LOGIN") {
      signIn('credentials', {
        ...data, 
        redirect: false
      }).then((callback) => {
        if(callback?.error){
          toast.error('Tài khoản này không tồn tại !');
        }
        if(callback?.ok && !callback.error){
          toast.success('Logged in!')
        }
      }).finally(()=> setIsLoading(false))
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false }).then((callback) => {
      if(callback?.error){
        toast.error('Invalid Credentials');
      }

      if(callback?.ok && !callback.error){
        toast.success('Logged in!');
        route.push('/users')
      }
    }).finally(() => setIsLoading(false))
  };

  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if(session?.status === 'authenticated'){
      console.info('Login success')
      route.push('/users')
    }    
  }, [session?.status, route]);
  
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input label="Name" id="name" errors={errors} register={register} disabled={isLoading}/>
          )}
          <Input
            label="Email address"
            id="email"
            errors={errors}
            register={register}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            errors={errors}
            register={register}
            disabled={isLoading}
          />
          <Button disabled={isLoading} fullWidth type="submit">
            {variant === "LOGIN" ? "Sign in" : "Register"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continute with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>{variant === "LOGIN" ? "New to Messenger?" : "Already"}</div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthForm;
