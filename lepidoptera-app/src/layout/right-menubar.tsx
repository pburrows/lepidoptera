import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarPortal, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@radix-ui/react-menubar";
import { Theme } from "@radix-ui/themes";
import { FaChevronRight, FaGear } from "react-icons/fa6";
import "./top-menubar.styles.css";

export default function RightMenubar() {
    return (
        <Menubar className="MenubarRoot">
            <MenubarMenu>
                <MenubarTrigger className="MenubarTrigger">
                    <FaGear />
                </MenubarTrigger>
                <MenubarPortal>
                    <Theme>
                        <MenubarContent
                            className="MenubarContent"
                            align="start"
                            sideOffset={5}
                            alignOffset={-3}
                        >
                            <MenubarItem className="MenubarItem">
                                New Tab <div className="RightSlot">⌘ T</div>
                            </MenubarItem>
                            <MenubarItem className="MenubarItem">
                                New Window <div className="RightSlot">⌘ N</div>
                            </MenubarItem>
                            <MenubarItem className="MenubarItem" disabled>
                                New Incognito Window
                            </MenubarItem>
                            <MenubarSeparator className="MenubarSeparator" />
                            <MenubarSub>
                                <MenubarSubTrigger className="MenubarSubTrigger">
                                    Share
                                    <div className="RightSlot">
                                        <FaChevronRight />
                                    </div>
                                </MenubarSubTrigger>
                                <MenubarPortal>
                                    <Theme>
                                        <MenubarSubContent
                                            className="MenubarSubContent"
                                            alignOffset={-5}
                                        >
                                            <MenubarItem className="MenubarItem">
                                                Email Link
                                            </MenubarItem>
                                            <MenubarItem className="MenubarItem">Messages</MenubarItem>
                                            <MenubarItem className="MenubarItem">Notes</MenubarItem>
                                        </MenubarSubContent>
                                    </Theme>
                                </MenubarPortal>
                            </MenubarSub>
                            <MenubarSeparator className="MenubarSeparator" />
                            <MenubarItem className="MenubarItem">
                                Print… <div className="RightSlot">⌘ P</div>
                            </MenubarItem>
                        </MenubarContent>
                    </Theme>
                </MenubarPortal>
            </MenubarMenu>
        </Menubar>
    )
}