"use client"
import { useState, useEffect } from 'react';
import { Github, ExternalLink, Twitter, Linkedin, Calendar, Search, Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HackathonSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('submissionDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [hackathonInfo, setHackathonInfo] = useState(null);
  const router = useRouter();

  // Load mock data on component mount
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      // Mock hackathon info
      setHackathonInfo({
        _id: 'mock123',
        name: 'Dev Innovate Hackathon 2025',
        createdBy: 'user123',
        startDate: new Date('2025-04-10'),
        endDate: new Date('2025-04-17')
      });
      
      // Mock submissions data
      const mockSubmissions = [
        {
          _id: '1',
          projectName: 'BlockChain Voting System',
          description: 'A secure voting system built on blockchain technology that ensures transparency and eliminates fraud in election processes.',
          demoLink: 'https://demo.example.com/voting',
          githubLink: 'https://github.com/team/voting-system',
          submissionDate: new Date('2025-04-15'),
          team: {
            name: 'CryptoCoders',
            address: 'San Francisco, CA',
            githubLink: 'https://github.com/cryptocoders',
            xLink: 'https://x.com/cryptocoders',
            linkedinLink: 'https://linkedin.com/company/cryptocoders'
          }
        },
        {
          _id: '2',
          projectName: 'AI Health Assistant',
          description: 'An AI-powered health monitoring and recommendation system that helps users track their health metrics and provides personalized wellness advice.',
          demoLink: 'https://health-ai.example.com',
          githubLink: 'https://github.com/team/health-ai',
          submissionDate: new Date('2025-04-16'),
          team: {
            name: 'HealthTech',
            address: 'Boston, MA',
            githubLink: 'https://github.com/healthtech',
            linkedinLink: 'https://linkedin.com/company/healthtech'
          }
        },
        {
          _id: '3',
          projectName: 'EcoTrack',
          description: 'Carbon footprint tracking app for individuals and businesses that provides actionable insights to reduce environmental impact.',
          demoLink: 'https://ecotrack.example.com',
          githubLink: 'https://github.com/team/ecotrack',
          submissionDate: new Date('2025-04-14'),
          team: {
            name: 'GreenDevs',
            address: 'Portland, OR',
            githubLink: 'https://github.com/greendevs',
            xLink: 'https://x.com/greendevs',
            linkedinLink: 'https://linkedin.com/company/greendevs'
          }
        },
        {
          _id: '4',
          projectName: 'StudyBuddy',
          description: 'A collaborative learning platform that connects students working on similar subjects and facilitates peer-to-peer tutoring sessions.',
          demoLink: 'https://studybuddy.example.com',
          githubLink: 'https://github.com/team/studybuddy',
          submissionDate: new Date('2025-04-13'),
          team: {
            name: 'EduTech Pioneers',
            address: 'Austin, TX',
            githubLink: 'https://github.com/edutech',
            xLink: 'https://x.com/edutech',
            linkedinLink: 'https://linkedin.com/company/edutech'
          }
        },
        {
          _id: '5',
          projectName: 'Urban Navigator',
          description: 'A city navigation app specifically designed for people with disabilities, featuring accessible routes and real-time public transport updates.',
          demoLink: 'https://urban-nav.example.com',
          githubLink: 'https://github.com/team/urban-navigator',
          submissionDate: new Date('2025-04-15'),
          team: {
            name: 'AccessTech',
            address: 'Chicago, IL',
            githubLink: 'https://github.com/accesstech',
            linkedinLink: 'https://linkedin.com/company/accesstech'
          }
        },
        {
          _id: '6',
          projectName: 'CommuniEats',
          description: 'A platform connecting local restaurants with food banks to reduce food waste and help feed those in need within the community.',
          demoLink: 'https://communieats.example.com',
          githubLink: 'https://github.com/team/communieats',
          submissionDate: new Date('2025-04-16'),
          team: {
            name: 'SocialImpact',
            address: 'Seattle, WA',
            githubLink: 'https://github.com/socialimpact',
            xLink: 'https://x.com/socialimpact',
            linkedinLink: 'https://linkedin.com/company/socialimpact'
          }
        }
      ];
      
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000); // Simulate 1 second loading time
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    // Mock logout functionality
    alert('Logout functionality would be implemented here');
    // router.push('/login');
  };

  const filteredAndSortedSubmissions = submissions
    .filter(submission => 
      submission.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.team.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'projectName') {
        comparison = a.projectName.localeCompare(b.projectName);
      } else if (sortBy === 'teamName') {
        comparison = a.team.name.localeCompare(b.team.name);
      } else if (sortBy === 'submissionDate') {
        comparison = new Date(a.submissionDate) - new Date(b.submissionDate);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8 bg-gray-200 min-h-screen text-black">
      {/* Header with auth indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {hackathonInfo?.name || 'Hackathon'} Submissions
          </h1>
          <p className="text-gray-600">
            {hackathonInfo && (
              <>Event period: {formatDate(hackathonInfo.startDate)} - {formatDate(hackathonInfo.endDate)}</>
            )}
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-md mr-4">
            <Shield className="h-4 w-4 mr-2" />
            <span>Organizer View</span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-8">As the organizer, you have exclusive access to view all project submissions</p>
      
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex space-x-4 w-full md:w-auto">
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="submissionDate-desc">Newest First</option>
            <option value="submissionDate-asc">Oldest First</option>
            <option value="projectName-asc">Project Name (A-Z)</option>
            <option value="projectName-desc">Project Name (Z-A)</option>
            <option value="teamName-asc">Team Name (A-Z)</option>
            <option value="teamName-desc">Team Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredAndSortedSubmissions.length} of {submissions.length} projects
      </p>
      
      {filteredAndSortedSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No matching submissions found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search criteria or check back later for new submissions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedSubmissions.map((submission) => (
            <div key={submission._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{submission.projectName}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="font-medium text-indigo-600">{submission.team.name}</span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(submission.submissionDate)}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{submission.description}</p>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      {submission.team.githubLink && (
                        <a href={submission.team.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {submission.team.xLink && (
                        <a href={submission.team.xLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {submission.team.linkedinLink && (
                        <a href={submission.team.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      {submission.githubLink && (
                        <a 
                          href={submission.githubLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md flex items-center text-sm"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      )}
                      {submission.demoLink && (
                        <a 
                          href={submission.demoLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}