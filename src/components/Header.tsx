import React from 'react';
import { Search, ShoppingBag, Menu, User, Heart } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ cartItemCount, onCartClick, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">LUXE</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 font-medium">Women</a>
            <a href="#" className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 font-medium">Men</a>
            <a href="#" className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 font-medium">Accessories</a>
            <a href="#" className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 font-medium">Sale</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md ml-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-yellow-600 transition-colors duration-200">
              <User className="w-6 h-6" />
            </button>
            <button className="text-gray-700 hover:text-yellow-600 transition-colors duration-200">
              <Heart className="w-6 h-6" />
            </button>
            <button 
              onClick={onCartClick}
              className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button className="md:hidden text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}