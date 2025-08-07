import React from 'react';
import { ReportData } from '../types/report';

interface PrintReportProps {
  data: ReportData;
}

export const PrintReport: React.FC<PrintReportProps> = ({ data }) => {
  const getImageUrl = (photo: any): string => {
    if (photo.file) {
      return URL.createObjectURL(photo.file);
    }
    if (photo.url) {
      return photo.url;
    }
    return 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  return (
    <div className="hidden print:block bg-white text-black">
      {/* Header */}
      <div className="print-section mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">TAGRAPPORTEN</h1>
        <div className="text-center text-gray-600 mb-6">
          Professionel taginspektionsrapport
        </div>
      </div>

      {/* Building & Contact Information */}
      <div className="print-section mb-8">
        <h2 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">BYGNING & KONTAKTPERSONER</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-medium py-1">Bygherre:</td>
                  <td className="py-1">{data.buildingContact.bygherre}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Adresse:</td>
                  <td className="py-1">{data.buildingContact.adresse}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Postnummer:</td>
                  <td className="py-1">{data.buildingContact.postnummer}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Kontaktperson:</td>
                  <td className="py-1">{data.buildingContact.kontaktperson}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Telefon:</td>
                  <td className="py-1">{data.buildingContact.telefon}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">E-mail:</td>
                  <td className="py-1">{data.buildingContact.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">AGRITECTUM kontakt:</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-medium py-1">Kontakt:</td>
                  <td className="py-1">{data.agritectumContact.kontakt}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Telefon:</td>
                  <td className="py-1">{data.agritectumContact.telefon}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">E-mail:</td>
                  <td className="py-1">{data.agritectumContact.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="print-section mb-8">
        <h2 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">INDHOLD</h2>
        <ol className="text-sm space-y-1">
          <li>1. Check liste fra tag gennemgang</li>
          <li>2. Dokumentation</li>
          <li>3. Anbefalinger</li>
          <li>4. Økonomi</li>
          <li>5. Ansvar</li>
        </ol>
      </div>

      {/* Checklist */}
      <div className="print-page-break">
        <div className="print-section mb-8">
          <h2 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">CHECK LISTE</h2>
          
          <table className="w-full border-collapse border border-gray-400 text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-2 text-left">Element</th>
                <th className="border border-gray-400 px-2 py-2 text-center">Ikke relevant</th>
                <th className="border border-gray-400 px-2 py-2 text-center">Ikke etableret</th>
                <th className="border border-gray-400 px-2 py-2 text-center">Etableret</th>
                <th className="border border-gray-400 px-2 py-2 text-center">m²</th>
                <th className="border border-gray-400 px-2 py-2 text-left">Kommentar / Anbefalinger</th>
              </tr>
            </thead>
            <tbody>
              {data.checklist.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-2 py-1">{item.name}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{item.ikkeRelevant ? 'X' : ''}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{item.ikkeEtableret ? 'X' : ''}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{item.etableret ? 'X' : ''}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{item.m2}</td>
                  <td className="border border-gray-400 px-2 py-1">{item.kommentar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsibility */}
      {data.responsibility.length > 0 && (
        <div className="print-section mb-8">
          <h2 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">ANSVAR</h2>
          
          <table className="w-full border-collapse border border-gray-400 text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-2 text-left">Opgave</th>
                <th className="border border-gray-400 px-2 py-2 text-left">Ansvarlig</th>
                <th className="border border-gray-400 px-2 py-2 text-center">Deadline</th>
                <th className="border border-gray-400 px-2 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.responsibility.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-2 py-1">{item.task}</td>
                  <td className="border border-gray-400 px-2 py-1">{item.responsible}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{item.deadline}</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    {item.status === 'completed' ? 'Afsluttet' : 
                     item.status === 'in-progress' ? 'I gang' : 'Afventer'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Documentation */}
      {data.photos.length > 0 && (
        <div className="print-page-break">
          <div className="print-section mb-8">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">DOKUMENTATION</h2>
            
            <div className="photo-grid">
              {data.photos.map((photo, index) => (
                <div key={photo.id} className="photo-item mb-6">
                  <div className="border border-gray-300 p-2">
                    <img
                      src={getImageUrl(photo)}
                      alt={photo.caption}
                      className="w-full h-32 object-cover mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <p className="text-xs text-center">
                      <strong>Foto {index + 1}:</strong> {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div className="print-page-break">
          <div className="print-section mb-8">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">ANBEFALINGER</h2>
            
            <div className="space-y-4">
              {data.recommendations.map((recommendation, index) => (
                <div key={recommendation.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{recommendation.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Economy */}
      {data.economy.length > 0 && (
        <div className="print-page-break">
          <div className="print-section mb-8">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">ØKONOMI</h2>
            
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-2 py-2 text-left">Beskrivelse</th>
                  <th className="border border-gray-400 px-2 py-2 text-center">Antal</th>
                  <th className="border border-gray-400 px-2 py-2 text-center">Enhed</th>
                  <th className="border border-gray-400 px-2 py-2 text-right">Pris</th>
                  <th className="border border-gray-400 px-2 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.economy.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-2 py-1">{item.description}</td>
                    <td className="border border-gray-400 px-2 py-1 text-center">{item.amount}</td>
                    <td className="border border-gray-400 px-2 py-1 text-center">{item.unit}</td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {item.price.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {item.total.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={4} className="border border-gray-400 px-2 py-1 text-right">Total:</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">
                    {data.economy.reduce((sum, item) => sum + item.total, 0).toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};