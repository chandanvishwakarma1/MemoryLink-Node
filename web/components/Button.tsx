import postUsers from "@/actions"
import { useState } from "react";
import ActivityIndicator from "./ActivityIndicator";
import Link from "next/link";
import { CheckIcon, CopyIcon, X } from "lucide-react";
import Modal from "./Modal";

interface ButtonProps {
  title: string,
  email: string,
}
const Button = ({ title, email }: ButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccured, setErrorOccured] = useState('');

  const handleJoinWaitList = async () => {
    console.log("Button clicked, email:", email);
    if (!email) return alert("Please enter an email");

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return alert("Please enter a valid email address.");
    }

    try {
      setIsLoading(true);
      const result = await postUsers(email);

      console.log("result from trybutton:", result)
      if (!result.success) {
        throw result.error;
      }
      setIsOpen(true)
    } catch (error) {
      setErrorOccured(error instanceof Error ? error.message : String(error));
      console.log("Error from catchbutton:", error)
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-button-light dark:bg-button-dark rounded-full p-3 w-max">
      <button
        onClick={handleJoinWaitList}
        className="text-button-txt-light font-medium dark:text-button-txt-dark w-32 flex justify-center"
      >
        {isLoading ? (
          <ActivityIndicator className="text-white dark:text-black" />
        ) : (
          title
        )}
      </button>

      {isOpen && <Modal onClose={() => setIsOpen(false)} errorOccured={errorOccured} />}
    </div>
  );
};


export default Button