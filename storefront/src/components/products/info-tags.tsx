import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

const InfoTags = () => {
    const t = useTranslations("Product")

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="shipping" className="max-w-lg">
                <AccordionTrigger>
                    <div className="flex space-x-3 items-center text-foreground/80">
                        <Truck />
                        <span>{t("fast-shipping")}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    {t("shipping-copywriting")}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="quality" className="max-w-lg ">
                <AccordionTrigger>
                    <div className="flex space-x-3 items-center text-foreground/80">
                        <ShieldCheck />
                        <span>{t("quality-guarantee")}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    {t("quality-guarantee-copywriting")}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns" className="max-w-lg ">
                <AccordionTrigger>
                    <div className="flex space-x-3 items-center text-foreground/80">
                        <ArrowLeft />
                        <span>{t("easy-returns")}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    {t("easy-returns-copywriting")}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default InfoTags;
