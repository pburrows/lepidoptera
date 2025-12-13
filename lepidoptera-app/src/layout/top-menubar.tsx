import {
    Menubar, MenubarCheckboxItem,
    MenubarContent, MenubarItem, MenubarItemIndicator,
    MenubarMenu,
    MenubarPortal, MenubarRadioGroup, MenubarRadioItem,
    MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger,
    MenubarTrigger
} from "@radix-ui/react-menubar";
import {useState} from "react";
import "./top-menubar.styles.css";
import {FaCheck, FaChevronRight} from "react-icons/fa6";
import {RxDotFilled} from "react-icons/rx";
import {Theme} from "@radix-ui/themes";


const RADIO_ITEMS = ["Andy", "Benoît", "Luis"];
const CHECK_ITEMS = ["Always Show Bookmarks Bar", "Always Show Full URLs"];

export default function TopMenubar() {

    const [checkedSelection, setCheckedSelection] = useState([
        CHECK_ITEMS[1],
    ]);
    const [radioSelection, setRadioSelection] = useState(RADIO_ITEMS[2]);
    return (
        <Menubar className="MenubarRoot">
            <MenubarMenu>
                <MenubarTrigger className="MenubarTrigger">File</MenubarTrigger>
                <MenubarPortal>
                    <Theme>
                        <MenubarContent
                            className="MenubarContent"
                            align="start"
                            sideOffset={5}
                            alignOffset={-3}
                        >
                            <MenubarItem className="MenubarItem">
                                New Document <div className="RightSlot">⌘ N</div>
                            </MenubarItem>
                            <MenubarItem className="MenubarItem">
                                New Ticket <div className="RightSlot">⌘ T</div>
                            </MenubarItem>
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarItem className="MenubarItem">
                                Open Workspace <div className="RightSlot"></div>
                            </MenubarItem>
                            <MenubarItem className="MenubarItem">
                                New Workspace <div className="RightSlot"></div>
                            </MenubarItem>
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarSub>
                                <MenubarSubTrigger className="MenubarSubTrigger">
                                    Share
                                    <div className="RightSlot">
                                        <FaChevronRight/>
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
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarItem className="MenubarItem">
                                Print… <div className="RightSlot">⌘ P</div>
                            </MenubarItem>
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarItem className="MenubarItem">
                                Quit <div className="RightSlot">⌘ P</div>
                            </MenubarItem>
                        </MenubarContent>
                    </Theme>
                </MenubarPortal>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger className="MenubarTrigger">Edit</MenubarTrigger>
                <MenubarPortal>
                    <Theme>
                        <MenubarContent
                            className="MenubarContent"
                            align="start"
                            sideOffset={5}
                            alignOffset={-3}
                        >
                            <MenubarItem className="MenubarItem">
                                Undo <div className="RightSlot">⌘ Z</div>
                            </MenubarItem>
                            <MenubarItem className="MenubarItem">
                                Redo <div className="RightSlot">⇧ ⌘ Z</div>
                            </MenubarItem>
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarSub>
                                <MenubarSubTrigger className="MenubarSubTrigger">
                                    Find
                                    <div className="RightSlot">
                                        <FaChevronRight/>
                                    </div>
                                </MenubarSubTrigger>

                                <MenubarPortal>
                                    <Theme>
                                        <MenubarSubContent
                                            className="MenubarSubContent"
                                            alignOffset={-5}
                                        >
                                            <MenubarItem className="MenubarItem">
                                                Search the web…
                                            </MenubarItem>
                                            <MenubarSeparator className="MenubarSeparator"/>
                                            <MenubarItem className="MenubarItem">Find…</MenubarItem>
                                            <MenubarItem className="MenubarItem">Find Next</MenubarItem>
                                            <MenubarItem className="MenubarItem">
                                                Find Previous
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </Theme>
                                </MenubarPortal>
                            </MenubarSub>
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarItem className="MenubarItem">Cut</MenubarItem>
                            <MenubarItem className="MenubarItem">Copy</MenubarItem>
                            <MenubarItem className="MenubarItem">Paste</MenubarItem>
                        </MenubarContent>
                    </Theme>
                </MenubarPortal>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger className="MenubarTrigger">View</MenubarTrigger>
                <MenubarPortal>
                    <Theme>
                        <MenubarContent
                            className="MenubarContent"
                            align="start"
                            sideOffset={5}
                            alignOffset={-14}
                        >
                            {CHECK_ITEMS.map((item) => (
                                <MenubarCheckboxItem
                                    className="MenubarCheckboxItem inset"
                                    key={item}
                                    checked={checkedSelection.includes(item)}
                                    onCheckedChange={() =>
                                        setCheckedSelection((current) =>
                                            current.includes(item)
                                                ? current.filter((el) => el !== item)
                                                : current.concat(item),
                                        )
                                    }
                                >
                                    <MenubarItemIndicator className="MenubarItemIndicator">
                                        <FaCheck/>
                                    </MenubarItemIndicator>
                                    {item}
                                </MenubarCheckboxItem>
                            ))}
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarItem className="MenubarItem inset">
                                Reload <div className="RightSlot">⌘ R</div>
                            </MenubarItem>
                            <MenubarItem className="MenubarItem inset" disabled>
                                Force Reload <div className="RightSlot">⇧ ⌘ R</div>
                            </MenubarItem>
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarItem className="MenubarItem inset">
                                Toggle Fullscreen
                            </MenubarItem>
                            <MenubarSeparator className="MenubarSeparator"/>
                            <MenubarItem className="MenubarItem inset">
                                Hide Sidebar
                            </MenubarItem>
                        </MenubarContent>
                    </Theme>
                </MenubarPortal>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger className="MenubarTrigger">Profiles</MenubarTrigger>

                <MenubarPortal>
                    <Theme>
                        <MenubarContent
                            className="MenubarContent"
                            align="start"
                            sideOffset={5}
                            alignOffset={-14}
                        >
                            <MenubarRadioGroup
                                value={radioSelection}
                                onValueChange={setRadioSelection}
                            >
                                {RADIO_ITEMS.map((item) => (
                                    <MenubarRadioItem
                                        className="MenubarRadioItem inset"
                                        key={item}
                                        value={item}
                                    >
                                        <MenubarItemIndicator className="MenubarItemIndicator">
                                            <RxDotFilled/>
                                        </MenubarItemIndicator>
                                        {item}
                                    </MenubarRadioItem>
                                ))}
                                <MenubarSeparator className="MenubarSeparator"/>
                                <MenubarItem className="MenubarItem inset">Edit…</MenubarItem>
                                <MenubarSeparator className="MenubarSeparator"/>
                                <MenubarItem className="MenubarItem inset">
                                    Add Profile…
                                </MenubarItem>
                            </MenubarRadioGroup>
                        </MenubarContent>
                    </Theme>
                </MenubarPortal>

            </MenubarMenu>
        </Menubar>

    )
}