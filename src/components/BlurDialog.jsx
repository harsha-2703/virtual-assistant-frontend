import { useEffect, useRef } from "react";
import { IoMdHelpCircle, IoMdHelpCircleOutline } from "react-icons/io";
import { Dropdown } from 'primereact/dropdown';
import Tooltip from "./base/Tooltip";
import { IoInformationCircle, IoInformationCircleOutline } from "react-icons/io5";


function BlurDialog({
    isOpen,
    apiKey,
    setApiKey,
    error,
    setError,
    onSubmit,
    onClose,
    mode,
    setMode,
    loadingApiKey
    }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                    aria-hidden="true"
                />

                {/* Dialog card */}
                <div className="relative z-10 w-full max-w-md mx-4">
                    <form
                    onSubmit={onSubmit}
                    className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6"
                    >
                        <h3 className="text-xl font-semibold mb-2">Welcome to your Virtual Assistant</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Paste your API key to unlock the chat
                        </p>

                        <label className="block text-sm font-medium mb-1">API Key</label>
                        
                        <div className="flex flex-row items-center space-x-4 relative">
                            <input
                            type="password"
                            ref={inputRef}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className={`w-full px-3 pr-12 py-2 border rounded-md mb-2 focus:outline-none ${
                                loadingApiKey ? 'cursor-not-allowed' : ''
                            }`}
                            placeholder="Enter the API key here..."
                            aria-label="API key"
                            disabled={loadingApiKey}
                            />
                            {/* Spinner */}
                            {loadingApiKey && (
                            <div className="absolute right-9 top-5 transform -translate-y-1/2">
                                <div className="w-6 h-6 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                            </div>
                            )}
                            <div className="relative flex items-center cursor-pointer group">
                                <IoMdHelpCircleOutline className="size-6 group-hover:hidden" />
                                <Tooltip  
                                    content={ 
                                    <div className="space-y-2">
                                        <b>Instructions for creating API key:</b><br /><br />
                                        <ol className="list-decimal list-inside space-y-1">
                                        <li>Go to Google AI Studio</li>
                                        <li>Click <b>Get API key</b></li>
                                        <li>Click <b>Create API key</b></li>
                                        <li>Copy the key and paste it here</li>
                                        </ol>
                                    </div>
                                    }
                                    position="bottom"
                                >
                                    <IoMdHelpCircle className="size-6 hidden group-hover:block" />
                                </Tooltip>
                            </div>
                        </div>

                        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

                        {/* dropdown */}
                        <label className="block text-sm font-medium mt-2 mb-1">Select an option</label>
                        <Dropdown
                            value={mode}
                            onChange={(e) => setMode(e.value)}
                            options={[
                                { name: 'Voice-Only', code: 'vo' },
                                { name: 'Text-Only', code: 'to' },
                            ]}
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select"
                            className="w-[35%] mb-2"
                            pt={{
                                root: { className: "border border-black rounded-md px-3 py-2" },
                                panel: { className: "border border-black rounded-md shadow-md mt-1 p-1" },
                                item: { className: "hover:bg-gray-300 cursor-pointer px-2 py-2" }
                            }}
                        />
                        
                        <div className="flex items-center justify-between gap-2 mt-25">
                            <button
                            type="button"
                            onClick={() => {
                                setApiKey("");
                                setError("");
                                localStorage.removeItem("MY_APP_API_KEY");
                            }}
                            className="px-3 py-2 rounded-md border hover:bg-gray-200 text-sm cursor-pointer"
                            >
                            Clear
                            </button>

                            <div className="flex gap-2 items-center">
                                <div className="relative flex items-center cursor-pointer group">
                                    <IoInformationCircleOutline className="size-6 group-hover:hidden" />
                                    <Tooltip
                                    content={
                                    <div>
                                        <p className="font-semibold">Text-only Mode (Without API key)</p>
                                        <br />
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>
                                            Can only process normal 
                                            <span className="block pl-5">conversation queries</span>
                                            </li>
                                            <li>No webcam/image support</li>
                                            <li>No real-time data processing</li>
                                        </ul>
                                    </div>}
                                    position="top"
                                    >
                                    <IoInformationCircle className="size-6 hidden group-hover:block" />
                                    </Tooltip>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                    setApiKey("");
                                    setError("");
                                    localStorage.removeItem("MY_APP_API_KEY");
                                    onClose();
                                    }}
                                    className="px-3 py-2 rounded-md border hover:bg-gray-200 text-sm cursor-pointer"
                                >
                                    Skip (text only)
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-black text-white text-sm cursor-pointer"
                                >
                                    Continue
                                </button>
                            </div>

                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            You can change or remove the key later using the header buttons.
                        </p>
                    </form>
                </div>
            </div>
        </>
  );
}


export default BlurDialog;
