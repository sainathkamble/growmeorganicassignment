import './index.css';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

export const TableCompo = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Artwork[] | null>(null);
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchArtworks = async (page: number) => {
        setLoading(true); setRowClick(rowClick);
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            const data = await response.json();
            const artworksData = data.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                place_of_origin: item.place_of_origin,
                artist_display: item.artist_display,
                inscriptions: item.inscriptions,
                date_start: item.date_start,
                date_end: item.date_end
            }));
            setArtworks(artworksData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch the first page when the component mounts
        fetchArtworks(currentPage);
    }, [currentPage]);

    const onPageChange = (event: any) => {
        const nextPage = event.page + 1;  // PrimeReact's DataTable page index is zero-based
        setCurrentPage(nextPage);  // Update current page, which triggers useEffect to fetch data
    };

    const selectionHandle = (e : any) => {
        setSelectedProducts(e.value);
    }

    return (
        <div className="flex justify-center items-center p-8">
             
            <DataTable className="border"  value={artworks}
             selectionMode={rowClick ? null : 'checkbox'} 
             selection={selectedProducts!} 
             onSelectionChange={selectionHandle}  
             paginator rows={5} 
             onPage={onPageChange}
             loading={loading}
             rowsPerPageOptions={[5, 10, 25, 50]} 
             tableStyle={{ minWidth: '40rem',  minHeight: '30rem'}}>
                
                <Column className="p-2" selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column className="border" field="title" header="Title" style={{ width: '20%' }}></Column>
                <Column className="border" field="place_of_origin" header="Place of Origin" style={{ width: '20%' }}></Column>
                <Column className="border" field="artist_display" header="Artist Display" style={{ width: '20%' }}></Column>
                <Column className="border" field="inscriptions" header="Inscriptions" style={{ width: '20%' }}></Column>
                <Column className="border" field="date_start" header="Date Start" style={{ width: '10%' }}></Column>
                <Column className="border" field="date_end" header="Date End" style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    );
}

        
