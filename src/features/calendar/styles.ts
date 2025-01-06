import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  dayContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: 60,
    height: 45,
    position: 'relative' as const,
    paddingBottom: 14,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  solarDay: {
    fontSize: 14,
    marginBottom: 2,
  },
  lunarDay: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center' as const,
    ...Platform.select({
      web: {
        userSelect: 'none',
      },
    }),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center' as const,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center' as const,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledText: {
    color: '#d3d3d3',
  },
  holidayContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  holidayMark: {
    paddingHorizontal: 2,
    marginVertical: 2,
  },
  holidayText: {
    fontSize: 10,
    textAlign: 'center',
  },
  holidayDot: {
    position: 'absolute' as const,
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff4d4f',
  },
  holidayName: {
    fontSize: 10,
    color: '#FF4D4F',
    marginBottom: 4,
    width: '100%',
    textAlign: 'center' as const,
    paddingHorizontal: 2,
    minWidth: 56,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
}); 