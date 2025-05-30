import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgreementVersion {
    version: string;
    docLink: string;
    acceptanceDate: string;
    publishedOn: string;
    ipAddress: string;
    status: "Accepted" | "Pending" | "Rejected";
}

interface AgreementModalProps {
    isOpen: boolean;
    onClose: () => void;
    agreement: AgreementVersion | null;
    onAccept?: (agreement: AgreementVersion) => void;
    onReject?: (agreement: AgreementVersion) => void;
}

const AgreementModal = ({ isOpen, onClose, agreement, onAccept, onReject }: AgreementModalProps) => {
    if (!agreement) return null;

    const handleAccept = () => {
        if (onAccept) {
            onAccept(agreement);
            onClose();
        }
    };

    const handleReject = () => {
        if (onReject) {
            onReject(agreement);
            onClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent
                className="max-w-4xl max-h-[80vh] overflow-y-auto"
                showCloseButton={false}
            >
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl">
                            Merchant Agreement
                        </DialogTitle>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <p className="text-sm">
                        This Merchant Agreement (the "Agreement") is made on February 22 2025, 5:26:32 pm
                        <br />
                        and effective from February 22 2025, 5:26:32 pm
                    </p>

                    <div className="space-y-4">
                        <h3 className="font-semibold">
                            BY AND BETWEEN:
                        </h3>

                        <p className="text-sm">
                            Zipypost Tech Pvt Ltd, a company incorporated under the Companies Act,2013,
                            <br />
                            and having its registered Office at F-12/4, DLF-1, Golf Course Road,
                            <br />
                            New Fluid Gym, Gurgaon, Haryana, 122022,
                            <br />
                            duly represented by its Authorized Signatory having official E-Mail admin@zipypost.com
                            <br />
                            (hereinafter referred to as "Service Provider" which expression shall, unless it be repugnant to the subject or context thereof,
                            <br />
                            mean and include its successors-in-interest, affiliates and assigns) of the FIRST PARTY
                        </p>

                        <h3 className="font-semibold">
                            AND
                        </h3>

                        <p className="text-sm">
                            DWIVEDI COURIER, a Private Limited Company
                            <br />
                            and having its registered office at Seller tst tezt Noida UTTAR PRADESH - 201307,
                            <br />
                            duly represented by its Authorized Signatory having official E Mail seller mail
                            <br />
                            (hereinafter referred to as "Merchant" which expression shall, unless it be repugnant to the subject or context thereof,
                            <br />
                            mean and include its successors-in-interest, affiliates and permitted assigns) of the SECOND PARTY
                        </p>

                        <p className="text-sm">
                            Service Provider and Merchant are individually referred to as a "Party" and collectively as the "Parties".
                        </p>

                        <h3 className="font-semibold">
                            WHEREAS
                        </h3>

                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li>
                                The Merchant is involved in the others business, among other things.
                            </li>

                            <li>
                                The Service Provider is involved in the following verticals of logistics:
                                <br />
                                warehousing and fulfillment, e-commerce SaaS, logistics aggregation,
                                <br />
                                courier-related services, and other verticals.
                            </li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Agreement Status: <span className={cn(
                            agreement.status === "Accepted" ? "text-green-600" : 
                            agreement.status === "Rejected" ? "text-red-600" : 
                            "text-yellow-600"
                        )}>{agreement.status}</span>
                    </div>
                    <div className="flex gap-2">
                        {agreement.status === "Pending" && (
                            <>
                                <Button
                                    variant="outline"
                                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                    onClick={handleAccept}
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept Agreement
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleReject}
                                >
                                    Reject Agreement
                                </Button>
                            </>
                        )}
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AgreementModal; 