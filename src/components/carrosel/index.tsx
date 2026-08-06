import img2 from '../../assets/LC.jpg';
import img3 from '../../assets/Casablanca.png';
import img4 from '../../assets/NK.jpg';
import img5 from '../../assets/Ad.jpg';
import img6 from '../../assets/cd.jpg';
import img7 from '../../assets/GC.jpeg';
import img8 from '../../assets/Lv.jpg';




export function Carrossel() {
  const imagens = [
    { id: '1', url: img2, alt: 'Roupa 1' },
    { id: '2', url: img3, alt: 'Roupa 2' },
    { id: '3', url: img4, alt: 'Roupa 3' },
    { id: '4', url: img5, alt: 'Roupa 4' },
    { id: '5', url: img6, alt: 'Roupa 5' }, // Alterado de img1 para img2
    { id: '6', url: img7, alt: 'Roupa 6' },
    { id: '7', url: img8, alt: 'Roupa 7' },
   
     // Alterado de img1 para img2
  ];

  return (
    <div className="relative w-full mx-auto my-0 py-2 flex overflow-x-hidden gap-4 select-none bg-black">
      
      {/* Primeiro Grupo */}
      <div className="flex items-center justify-around gap-4 animate-marquee shrink-0 min-w-full">
        {imagens.map((item, index) => (
          <div key={`group1-${item.id}-${index}`} className="flex-none w-[3em] h-[3em] rounded-[.2em] overflow-hidden">
            <img src={item.url} alt={item.alt} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Segundo Grupo */}
      <div aria-hidden="true" className="flex items-center justify-around gap-4 animate-marquee shrink-0 min-w-full">
        {imagens.map((item, index) => (
          <div key={`group2-${item.id}-${index}`} className="flex-none w-[3em] h-[3em] rounded-[.2em] overflow-hidden">
            <img src={item.url} alt={item.alt} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

    </div>
  );
}
