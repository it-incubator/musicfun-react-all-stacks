import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Card } from '../Card'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog'
import { Typography } from '../Typography'
import { Autocomplete, type AutocompleteOption } from './Autocomplete'

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

// Sample data
const programmingLanguages: AutocompleteOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'swift', label: 'Swift' },
]

const musicGenres: AutocompleteOption[] = [
  { value: 'rock', label: 'Rock' },
  { value: 'pop', label: 'Pop' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'classical', label: 'Classical' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'hiphop', label: 'Hip Hop' },
  { value: 'country', label: 'Country' },
  { value: 'blues', label: 'Blues' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'folk', label: 'Folk' },
  { value: 'metal', label: 'Metal' },
  { value: 'indie', label: 'Indie' },
]

const skills: AutocompleteOption[] = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'fullstack', label: 'Full Stack Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'devops', label: 'DevOps' },
  { value: 'testing', label: 'Testing & QA' },
  { value: 'design', label: 'UI/UX Design' },
  { value: 'pm', label: 'Project Management', disabled: true },
  { value: 'data', label: 'Data Science' },
  { value: 'ml', label: 'Machine Learning' },
]

export const Basic = {
  render: () => {
    const [search, setSearch] = useState<string>('')
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    return (
      <div style={{ width: '400px' }}>
        <Autocomplete
          label="Programming Languages"
          placeholder="Search and select languages..."
          options={programmingLanguages}
          value={selectedValues}
          onChange={setSelectedValues}
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      </div>
    )
  },
}

export const WithMaxTags = {
  render: () => {
    const [search, setSearch] = useState<string>('')
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    return (
      <div style={{ width: '400px' }}>
        <Autocomplete
          label="Music Genres (max 3)"
          placeholder="Choose up to 3 genres..."
          options={musicGenres}
          value={selectedValues}
          onChange={setSelectedValues}
          maxTags={3}
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      </div>
    )
  },
}

export const WithPreselected = {
  render: () => {
    const [search, setSearch] = useState<string>('')
    const [selectedValues, setSelectedValues] = useState<string[]>(['javascript', 'typescript'])

    return (
      <div style={{ width: '400px' }}>
        <Autocomplete
          label="Your Skills"
          placeholder="Add more skills..."
          options={programmingLanguages}
          value={selectedValues}
          onChange={setSelectedValues}
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      </div>
    )
  },
}

export const WithDisabledOptions = {
  render: () => {
    const [search, setSearch] = useState<string>('')
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    return (
      <div style={{ width: '400px' }}>
        <Autocomplete
          label="Skills & Roles"
          placeholder="Select your skills..."
          options={skills}
          value={selectedValues}
          onChange={setSelectedValues}
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      </div>
    )
  },
}

export const Disabled = {
  render: () => {
    const [search, setSearch] = useState<string>('')
    const [selectedValues, setSelectedValues] = useState<string[]>(['rock', 'jazz'])

    return (
      <div style={{ width: '400px' }}>
        <Autocomplete
          label="Music Genres (disabled)"
          placeholder="Cannot select"
          options={musicGenres}
          value={selectedValues}
          onChange={setSelectedValues}
          disabled
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      </div>
    )
  },
}

export const WithError = {
  render: () => {
    const [search, setSearch] = useState<string>('')
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    return (
      <div style={{ width: '400px' }}>
        <Autocomplete
          label="Required Skills"
          placeholder="Select at least one skill..."
          options={programmingLanguages}
          value={selectedValues}
          onChange={setSelectedValues}
          errorMessage="Please select at least one programming language"
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      </div>
    )
  },
}

export const Interactive = {
  render: () => {
    const [backendSkills, setBackendSkills] = useState<string[]>([])
    const [frontendSkills, setFrontendSkills] = useState<string[]>(['javascript'])
    const [genres, setGenres] = useState<string[]>([])
    const [search, setSearch] = useState<string>('')

    const frontendOptions: AutocompleteOption[] = [
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
    ]

    const backendOptions: AutocompleteOption[] = [
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' },
      { value: 'php', label: 'PHP' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
    ]

    return (
      <div
        style={{
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
        <div>
          <Typography variant="h3" style={{ marginBottom: '16px' }}>
            Developer Profile Setup
          </Typography>
        </div>

        <Autocomplete
          label="Frontend Technologies"
          placeholder="Select frontend skills..."
          options={frontendOptions}
          value={frontendSkills}
          onChange={setFrontendSkills}
          maxTags={5}
          searchTerm={search}
          setSearchTerm={setSearch}
        />

        <Autocomplete
          label="Backend Technologies"
          placeholder="Select backend skills..."
          options={backendOptions}
          value={backendSkills}
          onChange={setBackendSkills}
          maxTags={4}
          searchTerm={search}
          setSearchTerm={setSearch}
        />

        <Autocomplete
          label="Favorite Music Genres"
          placeholder="What music do you like?"
          options={musicGenres}
          value={genres}
          onChange={setGenres}
          maxTags={6}
          searchTerm={search}
          setSearchTerm={setSearch}
        />

        <Card style={{ padding: '16px' }}>
          <Typography variant="h3" style={{ marginBottom: '12px' }}>
            Profile Summary
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography variant="body2">
              <strong>Frontend:</strong>{' '}
              {frontendSkills.length > 0 ? frontendSkills.join(', ') : 'None'}
            </Typography>
            <Typography variant="body2">
              <strong>Backend:</strong>{' '}
              {backendSkills.length > 0 ? backendSkills.join(', ') : 'None'}
            </Typography>
            <Typography variant="body2">
              <strong>Music:</strong> {genres.length > 0 ? genres.join(', ') : 'None'}
            </Typography>
          </div>
        </Card>
      </div>
    )
  },
}

export const AllStates = {
  render: () => {
    const [search1, setSearch1] = useState<string>('')
    const [search2, setSearch2] = useState<string>('')
    const [search3, setSearch3] = useState<string>('')
    const [search4, setSearch4] = useState<string>('')

    const [state1, setState1] = useState<string[]>([])
    const [state2, setState2] = useState<string[]>(['rock', 'jazz'])
    const [state3, setState3] = useState<string[]>([])
    const [state4, setState4] = useState<string[]>(['javascript'])

    return (
      <div
        style={{
          width: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}>
        <div>
          <Typography variant="h3" style={{ marginBottom: '12px' }}>
            Empty State
          </Typography>
          <Autocomplete
            label="Programming Languages"
            placeholder="Start typing to search..."
            options={programmingLanguages}
            value={state1}
            onChange={setState1}
            searchTerm={search1}
            setSearchTerm={setSearch1}
          />
        </div>

        <div>
          <Typography variant="h3" style={{ marginBottom: '12px' }}>
            With Selected Values
          </Typography>
          <Autocomplete
            label="Music Genres"
            placeholder="Add more genres..."
            options={musicGenres}
            value={state2}
            onChange={setState2}
            searchTerm={search2}
            setSearchTerm={setSearch2}
          />
        </div>

        <div>
          <Typography variant="h3" style={{ marginBottom: '12px' }}>
            With Error
          </Typography>
          <Autocomplete
            label="Required Field"
            placeholder="This field is required"
            options={programmingLanguages}
            value={state3}
            onChange={setState3}
            errorMessage="Please select at least one option"
            searchTerm={search3}
            setSearchTerm={setSearch3}
          />
        </div>

        <div>
          <Typography variant="h3" style={{ marginBottom: '12px' }}>
            Disabled State
          </Typography>
          <Autocomplete
            label="Locked Selection"
            placeholder="Cannot modify"
            options={programmingLanguages}
            value={state4}
            onChange={setState4}
            disabled
            searchTerm={search4}
            setSearchTerm={setSearch4}
          />
        </div>
      </div>
    )
  },
}

export const InDialog = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState<string>('')
    const [selectedGenres, setSelectedGenres] = useState<string[]>(['rock'])
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])

    const handleSubmit = () => {
      console.log('Selected skills:', selectedSkills)
      console.log('Selected genres:', selectedGenres)
      setIsOpen(false)
    }

    const handleReset = () => {
      setSelectedSkills([])
      setSelectedGenres([])
    }

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Profile Settings</Button>

        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <DialogHeader>
            <Typography variant="h2">Edit Your Profile</Typography>
            <Typography variant="body2" style={{ color: 'var(--color-text-secondary)' }}>
              Update your skills and music preferences
            </Typography>
          </DialogHeader>

          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                minWidth: '400px',
              }}>
              <Autocomplete
                label="Technical Skills"
                placeholder="Search and select your skills..."
                options={skills}
                value={selectedSkills}
                onChange={setSelectedSkills}
                maxTags={8}
                isRenderInPortal
                searchTerm={search}
                setSearchTerm={setSearch}
              />

              <Autocomplete
                label="Favorite Music Genres"
                placeholder="What music do you enjoy?"
                options={musicGenres}
                value={selectedGenres}
                onChange={setSelectedGenres}
                maxTags={5}
                isRenderInPortal
                searchTerm={search}
                setSearchTerm={setSearch}
              />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button variant="secondary" onClick={handleReset}>
              Reset All
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Profile
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}
