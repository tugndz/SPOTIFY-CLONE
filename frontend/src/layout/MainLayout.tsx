import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";


const MainLayout = () => {
    const isMobile = false;
    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <ResizablePanelGroup direction="horizontal" className="flex-1 h-full overflow-hidden p-2">
                <AudioPlayer />
                {/* thanh bên trái */}
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={20}>
                    <LeftSidebar />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

                {/* nội dung chính */}
                <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                    <Outlet />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

                {/* thanh bên phải */}
                <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
                    <FriendsActivity />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default MainLayout
