"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Avatar from "../../(site)/components/Avatar";

interface UserBoxProps {
  data: User;
}
const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        userId: data.id,
      })
      .then((result) => {
        console.info('result',result)
        router.push(`/conversations/${result.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <div
      className="
            w-full
            relative
            flex
            items-center
            space-x-3
            bg-white
            p-3
            hover:bg-neutral-100
            rounded-lg
            transition
            cursor-pointer
        "
        onClick={handleClick}
    >
      <Avatar user={data} />
      <div className="focus:outline-none">
        <div
          className="
                    flex 
                    justify-between 
                    items-center 
                    mb-1"
        >
            {data.name}
        </div>
      </div>
    </div>
  );
};

export default UserBox;
