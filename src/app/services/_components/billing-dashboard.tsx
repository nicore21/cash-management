'use client';
import type { Customer, Service, ServiceCategory } from "@/lib/types";
import { useState } from "react";
import ServiceForm from "./service-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categoryDisplayOrder: ServiceCategory[] = ["BANKING", "G2C", "PRINT", "DOC", "OTHER"];

export default function BillingDashboard({ customers, services }: { customers: Customer[], services: Service[] }) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const servicesByCategory = services.reduce((acc, service) => {
        if (!acc[service.category]) {
            acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
    }, {} as Record<ServiceCategory, Service[]>);

    const handleSelectService = (service: Service) => {
        setSelectedService(service);
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Select a Service</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {categoryDisplayOrder.map(category => (
                             servicesByCategory[category] && (
                                <div key={category}>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">{category}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2">
                                        {servicesByCategory[category].map(service => (
                                            <Button
                                                key={service.code}
                                                variant={selectedService?.code === service.code ? 'secondary' : 'outline'}
                                                className="h-auto whitespace-normal text-xs justify-center text-center"
                                                onClick={() => handleSelectService(service)}
                                            >
                                                {service.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{selectedService ? `Billing for: ${selectedService.name}` : 'New Transaction'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ServiceForm customers={customers} services={services} selectedService={selectedService} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
