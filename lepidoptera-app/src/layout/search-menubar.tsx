import { Box, Button, Flex, Section, TextField } from "@radix-ui/themes";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function SearchMenubar() {
    return (
        <Flex style={{ marginTop: "3px" }}>
            <Button style={{backgroundColor: "var(--gray-2)"}} variant="soft" color="gray" radius="none"><FaChevronLeft /></Button>
            <Button style={{backgroundColor: "var(--gray-2)"}} variant="soft" color="gray" radius="none"><FaChevronRight /></Button>
            <TextField.Root style={{ width: "100%" }}>
                <TextField.Slot>
                    <FaSearch />
                </TextField.Slot>
            </TextField.Root>
        </Flex>
    )
}