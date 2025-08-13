import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Quote } from '../shared/types';
import { Plus, Calculator, Eye, Edit } from 'lucide-react';
import CreateQuoteModal from '../components/CreateQuoteModal';

export default function QuotesPage() {
  const { user } = useAuth();
  const { dataService } = useData();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        if (!user) return;

        let fetchedQuotes: Quote[] = [];

        if (user.role === 'SUPER_ADMIN') {
          // Super admin sees all quotes across all organizations
          const organizations = await dataService.getOrganizations();
          for (const org of organizations) {
            const orgQuotes = await dataService.getQuotes(org.id);
            fetchedQuotes.push(...orgQuotes);
          }
        } else if (user.role === 'ORG_ADMIN') {
          // Org admin sees all quotes in their organization
          fetchedQuotes = await dataService.getQuotes(user.orgId);
        } else if (user.role === 'ROOFER') {
          // Roofer sees only their own quotes
          fetchedQuotes = await dataService.getQuotes(user.orgId, user.departmentId, user.uid);
        }

        setQuotes(fetchedQuotes);
      } catch (error) {
        console.error('Error loading quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, [user, dataService]);

  const handleQuoteCreated = (newQuote: Quote) => {
    setQuotes(prev => [newQuote, ...prev]);
    setShowCreateModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100';
      case 'SENT':
        return 'text-blue-600 bg-blue-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600">
            {user?.role === 'ROOFER' ? 'Your quotes' : 'Manage quotes'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </button>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-12">
          <Calculator className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new quote.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Quote
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {quotes.map((quote) => (
              <li key={quote.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calculator className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {quote.customer.name}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">
                            {quote.total.toLocaleString()} {quote.currency}
                          </p>
                          <p className="text-sm text-gray-500">
                            {quote.lineItems.length} items • Created {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {quote.lineItems.slice(0, 3).map((item) => (
                        <span key={item.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {item.description}
                        </span>
                      ))}
                      {quote.lineItems.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          +{quote.lineItems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showCreateModal && (
        <CreateQuoteModal
          onClose={() => setShowCreateModal(false)}
          onQuoteCreated={handleQuoteCreated}
        />
      )}
    </div>
  );
}