import { supabase } from '@/integrations/supabase/client';
import { CompanyProfile, JobPosting } from '@/models/types';

export const companyAPI = {
  createInitialProfile: async (profileData: Partial<CompanyProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('company_profiles')
        .insert([
          {
            ...profileData,
            user_id: user.id,
          },
        ]);

      if (error) {
        console.error('Error creating company profile:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Error in createInitialProfile:', error);
      throw new Error(error.message || 'Failed to create company profile');
    }
  },

  updateProfile: async (profileData: Partial<CompanyProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('company_profiles')
        .update(profileData)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating company profile:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      throw new Error(error.message || 'Failed to update company profile');
    }
  },

  getCompanyProfile: async (): Promise<CompanyProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching company profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCompanyProfile:', error);
      return null;
    }
  },
};

export const jobAPI = {
  createJob: async (jobData: Partial<JobPosting>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const companyProfile = await companyAPI.getCompanyProfile();
      if (!companyProfile) throw new Error('No company profile found');

      const { data, error } = await supabase
        .from('job_postings')
        .insert([
          {
            ...jobData,
            company_id: companyProfile.id,
            user_id: user.id,
          },
        ]);

      if (error) {
        console.error('Error creating job posting:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Error in createJob:', error);
      throw new Error(error.message || 'Failed to create job posting');
    }
  },

  updateJob: async (jobId: string, jobData: Partial<JobPosting>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('job_postings')
        .update(jobData)
        .eq('id', jobId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating job posting:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Error in updateJob:', error);
      throw new Error(error.message || 'Failed to update job posting');
    }
  },

  getJob: async (jobId: string): Promise<JobPosting | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching job posting:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getJob:', error);
      return null;
    }
  },

  getJobs: async (): Promise<JobPosting[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const companyProfile = await companyAPI.getCompanyProfile();
      if (!companyProfile) throw new Error('No company profile found');

      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('company_id', companyProfile.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching job postings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getJobs:', error);
      return [];
    }
  },

  deleteJob: async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', jobId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting job posting:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Error in deleteJob:', error);
      throw new Error(error.message || 'Failed to delete job posting');
    }
  },
};

export const skills = [
  "JavaScript",
  "React",
  "Node.js",
  "HTML",
  "CSS",
  "Python",
  "Java",
  "C++",
  "C#",
  "SQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "TypeScript",
  "Angular",
  "Vue.js",
  "GraphQL",
  "REST API",
  "Firebase",
  "Next.js",
  "Tailwind CSS",
  "Redux",
  "Saga",
  "Jest",
  "Cypress",
  "Jenkins",
  "Terraform",
  "Ansible",
  "Chef",
  "Puppet",
  "Elasticsearch",
  "Kafka",
  "RabbitMQ",
  "Redis",
  "PostgreSQL",
  "MySQL",
  "NoSQL",
  "Data Science",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "Matplotlib",
  "Seaborn",
  "Tableau",
  "Power BI",
  "Data Analysis",
  "Data Visualization",
  "Big Data",
  "Hadoop",
  "Spark",
  "Cloud Computing",
  "DevOps",
  "Agile",
  "Scrum",
  "Kanban",
  "Project Management",
  "Product Management",
  "UI/UX Design",
  "Figma",
  "Sketch",
  "Adobe XD",
  "Web Design",
  "Mobile App Development",
  "iOS Development",
  "Android Development",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Xamarin",
  "Blockchain",
  "Solidity",
  "Ethereum",
  "Smart Contracts",
  "Cybersecurity",
  "Ethical Hacking",
  "Penetration Testing",
  "Network Security",
  "Information Security",
  "Cryptography",
  "Artificial Intelligence",
  "Natural Language Processing",
  "Computer Vision",
  "Robotics",
  "Automation",
  "Internet of Things (IoT)",
  "Embedded Systems",
  "C",
  "Assembly",
  "Verilog",
  "VHDL",
  "FPGA",
  "Microcontrollers",
  "Signal Processing",
  "Control Systems",
  "Robotics",
  "Game Development",
  "Unity",
  "Unreal Engine",
  "Cg",
  "HLSL",
  "Shader Programming",
  "3D Modeling",
  "Animation",
  "Virtual Reality (VR)",
  "Augmented Reality (AR)",
  "Mixed Reality (MR)",
  "Spatial Computing",
  "Quantum Computing",
  "Bioinformatics",
  "Genomics",
  "Proteomics",
  "Systems Biology",
  "Biostatistics",
  "Healthcare Informatics",
  "Medical Imaging",
  "Pharmaceuticals",
  "Clinical Trials",
  "Regulatory Affairs",
  "Market Research",
  "Business Development",
  "Sales",
  "Marketing",
  "Finance",
  "Accounting",
  "Economics",
  "Management",
  "Leadership",
  "Communication",
  "Negotiation",
  "Problem Solving",
  "Critical Thinking",
  "Creativity",
  "Innovation",
  "Entrepreneurship",
  "Startups",
  "Venture Capital",
  "Private Equity",
  "Mergers and Acquisitions",
  "Investment Banking",
  "Financial Analysis",
  "Risk Management",
  "Compliance",
  "Auditing",
  "Taxation",
  "Real Estate",
  "Supply Chain Management",
  "Logistics",
  "Operations Management",
  "Quality Control",
  "Process Improvement",
  "Lean Manufacturing",
  "Six Sigma",
  "Project Planning",
  "Resource Management",
  "Stakeholder Management",
  "Change Management",
  "Conflict Resolution",
  "Team Building",
  "Motivation",
  "Performance Management",
  "Training and Development",
  "Human Resources",
  "Recruiting",
  "Compensation and Benefits",
  "Employee Relations",
  "Labor Law",
  "Organizational Development",
  "Diversity and Inclusion",
  "Sustainability",
  "Environmental Management",
  "Social Responsibility",
  "Governance",
  "Ethics",
  "Compliance",
  "Legal",
  "Intellectual Property",
  "Contract Law",
  "Litigation",
  "Arbitration",
  "Mediation",
  "Government Relations",
  "Public Policy",
  "Lobbying",
  "Advocacy",
  "Nonprofit Management",
  "Fundraising",
  "Grant Writing",
  "Volunteer Management",
  "Community Development",
  "Social Work",
  "Counseling",
  "Psychology",
  "Sociology",
  "Anthropology",
  "Education",
  "Teaching",
  "Curriculum Development",
  "Educational Technology",
  "Special Education",
  "Higher Education",
  "Research",
  "Writing",
  "Editing",
  "Proofreading",
  "Journalism",
  "Public Relations",
  "Advertising",
  "Content Creation",
  "Social Media Marketing",
  "Search Engine Optimization (SEO)",
  "Search Engine Marketing (SEM)",
  "Email Marketing",
  "Affiliate Marketing",
  "Influencer Marketing",
  "Video Marketing",
  "Mobile Marketing",
  "Data-Driven Marketing",
  "Customer Relationship Management (CRM)",
  "Salesforce",
  "HubSpot",
  "Marketo",
  "Adobe Marketing Cloud",
  "Google Analytics",
  "Data Science",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "Matplotlib",
  "Seaborn",
  "Tableau",
  "Power BI",
  "Data Analysis",
  "Data Visualization",
  "Big Data",
  "Hadoop",
  "Spark",
  "Cloud Computing",
  "DevOps",
  "Agile",
  "Scrum",
  "Kanban",
  "Project Management",
  "Product Management",
  "UI/UX Design",
  "Figma",
  "Sketch",
  "Adobe XD",
  "Web Design",
  "Mobile App Development",
  "iOS Development",
  "Android Development",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Xamarin",
  "Blockchain",
  "Solidity",
  "Ethereum",
  "Smart Contracts",
  "Cybersecurity",
  "Ethical Hacking",
  "Penetration Testing",
  "Network Security",
  "Information Security",
  "Cryptography",
  "Artificial Intelligence",
  "Natural Language Processing",
  "Computer Vision",
  "Robotics",
  "Automation",
  "Internet of Things (IoT)",
  "Embedded Systems",
  "C",
  "Assembly",
  "Verilog",
  "VHDL",
  "FPGA",
  "Microcontrollers",
  "Signal Processing",
  "Control Systems",
  "Robotics",
  "Game Development",
  "Unity",
  "Unreal Engine",
  "Cg",
  "HLSL",
  "Shader Programming",
  "3D Modeling",
  "Animation",
  "Virtual Reality (VR)",
  "Augmented Reality (AR)",
  "Mixed Reality (MR)",
  "Spatial Computing",
  "Quantum Computing",
  "Bioinformatics",
  "Genomics",
  "Proteomics",
  "Systems Biology",
  "Biostatistics",
  "Healthcare Informatics",
  "Medical Imaging",
  "Pharmaceuticals",
  "Clinical Trials",
  "Regulatory Affairs",
  "Market Research",
  "Business Development",
  "Sales",
  "Marketing",
  "Finance",
  "Accounting",
  "Economics",
  "Management",
  "Leadership",
  "Communication",
  "Negotiation",
  "Problem Solving",
  "Critical Thinking",
  "Creativity",
  "Innovation",
  "Entrepreneurship",
  "Startups",
  "Venture Capital",
  "Private Equity",
  "Mergers and Acquisitions",
  "Investment Banking",
  "Financial Analysis",
  "Risk Management",
  "Compliance",
  "Auditing",
  "Taxation",
  "Real Estate",
  "Supply Chain Management",
  "Logistics",
  "Operations Management",
  "Quality Control",
  "Process Improvement",
  "Lean Manufacturing",
  "Six Sigma",
  "Project Planning",
  "Resource Management",
  "Stakeholder Management",
  "Change Management",
  "Conflict Resolution",
  "Team Building",
  "Motivation",
  "Performance Management",
  "Training and Development",
  "Human Resources",
  "Recruiting",
  "Compensation and Benefits",
  "Employee Relations",
  "Labor Law",
  "Organizational Development",
  "Diversity and Inclusion",
  "Sustainability",
  "Environmental Management",
  "Social Responsibility",
  "Governance",
  "Ethics",
  "Compliance",
  "Legal",
  "Intellectual Property",
  "Contract Law",
  "Litigation",
  "Arbitration",
  "Mediation",
  "Government Relations",
  "Public Policy",
  "Lobbying",
  "Advocacy",
  "Nonprofit Management",
  "Fundraising",
  "Grant Writing",
  "Volunteer Management",
  "Community Development",
  "Social Work",
  "Counseling",
  "Psychology",
  "Sociology",
  "Anthropology",
  "Education",
  "Teaching",
  "Curriculum Development",
  "Educational Technology",
  "Special Education",
  "Higher Education",
  "Research",
  "Writing",
  "Editing",
  "Proofreading",
  "Journalism",
  "Public Relations",
  "Advertising",
  "Content Creation",
  "Social Media Marketing",
  "Search Engine Optimization (SEO)",
  "Search Engine Marketing (SEM)",
  "Email Marketing",
  "Affiliate Marketing",
  "Influencer Marketing",
  "Video Marketing",
  "Mobile Marketing",
  "Data-Driven Marketing",
  "Customer Relationship Management (CRM)",
  "Salesforce",
  "HubSpot",
  "Marketo",
  "Adobe Marketing Cloud",
  "Google Analytics"
];
