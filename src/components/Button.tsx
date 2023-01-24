import React from "react";

interface Props {
    text: string,
    onClick: () => void,
    loading?: boolean
}

export default function Button({ text, onClick,loading }: Props) {
    return (
        <button onClick={() => onClick()} className={`px-5 text-lg rounded-lg font-semibold bg-gradient-to-r from-primary to-primary-focus text-gray-900 ${loading ? "pt-2" : "py-3"}`}>
            {
                loading ? <div className="spinner-border animate-spin border-black inline-block w-8 h-8 border-4 rounded-full">
                </div> : text
            }
        </button>
    )
}