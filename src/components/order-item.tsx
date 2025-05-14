export const OrderItem = () => {
    return <div className="p-4 space-y-1 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center">
            <span>Sipariş numarası</span>
            <span className="font-bold">25532324</span>
        </div>
        <div className="flex justify-between items-center">
            <span>İptal edilebilir mi?</span>
            <span className="font-bold">Evet</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Son durum</span>
            <span className="font-bold">İptal edildi</span>
        </div>
    </div>
};
